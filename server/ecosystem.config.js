module.exports = {
    apps: [
      {
        name: "chat-app",
        script: "./server.js",
        instances: 4, // or a number like 4
        exec_mode: "cluster",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  