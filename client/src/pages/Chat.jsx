import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from '@/components/ui/button';
import { io } from "socket.io-client";

const socket = io();

const ChatPage = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/chat").then(res => res.json()).then(setChatMessages);

    socket.on("chat-message", msg => {
      setChatMessages(prev => [...prev, msg]);
    });

    return () => socket.off("chat-message");
  }, []);

  const sendMessage = () => {
    socket.emit("chat-message", message);
    setMessage("");
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Chat</h2>
        <div className="h-64 overflow-y-auto border p-2 mb-2">
          {chatMessages.map((msg, idx) => (
            <div key={idx}>{msg.message}</div>
          ))}
        </div>
        <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
        <Button onClick={sendMessage} className="mt-2">Send</Button>
      </CardContent>
    </Card>
  );
};

export default ChatPage;