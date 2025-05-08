import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatPage from "./pages/Chat";
import PostPage from "./pages/Post";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4 space-x-4">
          <Link to="/chat" className="text-blue-500">Chat</Link>
          <Link to="/posts" className="text-blue-500">Posts</Link>
        </nav>
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/posts" element={<PostPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;