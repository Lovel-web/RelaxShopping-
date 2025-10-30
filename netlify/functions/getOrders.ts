// ✅ netlify/functions/getOrders.ts

import { Handler } from "@netlify/functions";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler: Handler = async (event) => {
  try {
    const { role, state, lga, vendorId } = JSON.parse(event.body || "{}");

    let q;
    if (role === "admin") {
      q = query(collection(db, "orders"), where("state", "==", state));
    } else if (role === "staff") {
      q = query(collection(db, "orders"), where("lga", "==", lga));
    } else if (role === "vendor") {
      q = query(collection(db, "orders"), where("vendorId", "==", vendorId));
    } else {
      return { statusCode: 403, body: "Unauthorized role" };
    }

    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    return { statusCode: 200, body: JSON.stringify(orders) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
