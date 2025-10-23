import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

export default function ChatPanel() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  const sendMsg = async () => {
    if (!msg.trim()) return;
    await addDoc(collection(db, "chats"), {
      uid: auth.currentUser.uid,
      message: msg,
      createdAt: new Date(),
    });
    setMsg("");
  };

  return (
    <div>
      <div>{messages.map((m, i) => <p key={i}>{m.message}</p>)}</div>
      <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type message..."/>
      <button onClick={sendMsg}>Send</button>
    </div>
  );
}
