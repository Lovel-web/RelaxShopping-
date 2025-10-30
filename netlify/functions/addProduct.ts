// ✅ netlify/functions/addProduct.ts

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
    const body = JSON.parse(event.body || "{}");
    const { name, price, image, vendorId, lga, state } = body;

    if (!name || !price || !vendorId) {
      return { statusCode: 400, body: "Missing fields" };
    }

    await addDoc(collection(db, "products"), {
      name,
      price: parseFloat(price),
      image: image || "",
      vendorId,
      lga,
      state,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product added successfully" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
