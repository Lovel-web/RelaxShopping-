// ✅ netlify/functions/bulkUploadProducts.ts

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
    const { products, vendorId, lga, state } = JSON.parse(event.body || "{}");
    if (!Array.isArray(products)) {
      return { statusCode: 400, body: "Products must be an array" };
    }

    for (const item of products) {
      if (!item.name || !item.price) continue;
      await addDoc(collection(db, "products"), {
        name: item.name.trim(),
        price: parseFloat(item.price),
        image: item.image || "",
        vendorId,
        lga,
        state,
        createdAt: new Date(),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Bulk upload complete" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
