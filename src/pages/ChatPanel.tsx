// ✅ src/pages/ChatPanel.tsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/ChatBubble";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatPanel() {
  const { profile } = useAuth();
  const { chatId } = useParams(); // optional chat route param
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
    const q = query(
      collection(db, "chats", chatId || "general", "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => doc.data());
      setMessages(msgs);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [profile, chatId]);

  async function handleSend() {
    if (!input.trim() || !profile) return;
    await addDoc(collection(db, "chats", chatId || "general", "messages"), {
      sender: profile.email,
      senderRole: profile.role,
      text: input.trim(),
      timestamp: serverTimestamp(),
    });
    setInput("");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4 text-center">
          💬 RelaxShopping Chat
        </h1>

        <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-white">
          {messages.length === 0 && (
            <p className="text-sm text-center text-gray-400">
              No messages yet. Start chatting!
            </p>
          )}
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              text={msg.text}
              sender={msg.sender}
              senderRole={msg.senderRole}
              isOwn={msg.sender === profile.email}
              timestamp={msg.timestamp?.toDate?.().toLocaleTimeString?.() || ""}
            />
          ))}
          <div ref={scrollRef} />
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
