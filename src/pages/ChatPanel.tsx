// ✅ src/pages/ChatPanel.tsx

import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

interface Message {

  sender: string;

  text: string;

  timestamp: string;

}

export default function ChatPanel() {

  const { user } = useAuth();

  const { orderId } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");

  useEffect(() => {

    // Simulate fetching previous messages

    setMessages([

      { sender: "Support", text: "Welcome to RelaxShopping chat!", timestamp: new Date().toISOString() },

    ]);

  }, []);

  const handleSend = () => {

    if (!input.trim()) return;

    const newMsg = {

      sender: user?.email || "You",

      text: input,

      timestamp: new Date().toISOString(),

    };

    setMessages((prev) => [...prev, newMsg]);

    setInput("");

  };

  return (

    <div className="min-h-screen bg-gray-50 p-4">

      <Card className="max-w-2xl mx-auto p-6">

        <h1 className="text-xl font-bold mb-4">Chat Support</h1>

        <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-white">

          {messages.map((msg, i) => (

            <div key={i} className={`mb-2 ${msg.sender === user?.email ? "text-right" : "text-left"}`}>

              <p className="text-sm">

                <strong>{msg.sender === user?.email ? "You" : msg.sender}:</strong> {msg.text}

              </p>

              <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>

            </div>

          ))}

        </div>

        <div className="flex mt-4 gap-2">

          <Input

            placeholder="Type a message..."

            value={input}

            onChange={(e) => setInput(e.target.value)}

            onKeyDown={(e) => e.key === "Enter" && handleSend()}

          />

          <Button onClick={handleSend}>Send</Button>

        </div>

      </Card>

    </div>

  );

}