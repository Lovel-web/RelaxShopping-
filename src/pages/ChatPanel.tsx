import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPanel({ orderId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `chats/${orderId}/messages`), (snap) => {
      setMessages(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, [orderId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, `chats/${orderId}/messages`), {
      text,
      sender: "staff",
      createdAt: new Date(),
    });
    setText('');
  };

  return (
    <div className="border p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-2">Chat</h2>
      <div className="max-h-60 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <p key={i} className={m.sender === "staff" ? "text-blue-600" : "text-gray-800"}>
            {m.sender}: {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
