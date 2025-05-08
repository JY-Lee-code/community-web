const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const redis = require("redis");
const cors = require("cors");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { v4: uuid } = require("uuid");

const pubClient = redis.createClient();
const subClient = pubClient.duplicate();
const client = redis.createClient();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

Promise.all([pubClient.connect(), subClient.connect(), client.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));

  app.use(cors());
  app.use(bodyParser.json());

  let posts = [];
  let comments = {};

  app.get("/api/chat", async (req, res) => {
    const messages = await client.lRange("chat", 0, -1);
    res.json(messages.map(msg => JSON.parse(msg)));
  });

  io.on("connection", socket => {
    socket.on("chat-message", msg => {
      const message = { message: msg, timestamp: Date.now() };
      client.rPush("chat", JSON.stringify(message));
      io.emit("chat-message", message);
    });
  });

  app.get("/api/posts", (req, res) => {
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const post = { id: uuid(), content: req.body.content };
    posts.push(post);
    res.json(post);
  });

  app.post("/api/posts/:id/comments", (req, res) => {
    const comment = { text: req.body.text };
    const id = req.params.id;
    if (!comments[id]) comments[id] = [];
    comments[id].push(comment);
    res.json(comment);
  });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server with Socket.IO running on port ${PORT}`));
});
