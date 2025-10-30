// ✅ netlify/functions/chatHandler.ts

import { Handler } from "@netlify/functions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler: Handler = async (event) => {
  try {
    const { sender, receiver, message, chatRoomId } = JSON.parse(event.body || "{}");

    if (!sender || !receiver || !message || !chatRoomId) {
      return { statusCode: 400, body: "Missing fields" };
    }

    await addDoc(collection(db, "chats"), {
      chatRoomId,
      sender,
      receiver,
      message,
      timestamp: new Date(),
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Chat stored" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
