import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetch("/api/posts").then(res => res.json()).then(setPosts);
  }, []);

  const submitPost = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newPost })
    });
    const data = await res.json();
    setPosts(prev => [...prev, data]);
    setNewPost("");
  };

  const submitComment = async (postId, text) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), data] }));
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Posts</h2>
        <Input value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Write a post..." />
        <Button onClick={submitPost} className="mt-2 mb-4">Post</Button>
        {posts.map(post => (
          <div key={post.id} className="mb-4 border-b pb-2">
            <p>{post.content}</p>
            <div className="mt-2">
              {(comments[post.id] || []).map((c, i) => <div key={i} className="text-sm ml-2">- {c.text}</div>)}
              <Input
                placeholder="Add comment..."
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    submitComment(post.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PostPage;
