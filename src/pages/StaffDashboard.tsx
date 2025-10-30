import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      const userDoc = doc(db, "users", user.uid);
      (async () => {
        const snap = await (await import("firebase/firestore")).getDoc(userDoc);
        const data = snap.data();
        const q = query(collection(db, "orders"), where("lga", "==", data?.lga));
        const unsubscribeOrders = onSnapshot(q, (snap) =>
          setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
      })();
    });
    return () => unsub();
  }, []);

  async function markDelivered(id: string) {
    await updateDoc(doc(db, "orders", id), { status: "delivered" });
  }

  async function cancelOrder(id: string) {
    await updateDoc(doc(db, "orders", id), { status: "cancelled" });
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
      {orders.map((o) => (
        <div key={o.id} className="border p-3 my-2 rounded">
          <p>Order: {o.id}</p>
          <p>Status: {o.status}</p>
          <button onClick={() => markDelivered(o.id)} className="bg-green-600 text-white px-3 py-1 rounded">Delivered</button>
          <button onClick={() => cancelOrder(o.id)} className="bg-red-600 text-white px-3 py-1 ml-2 rounded">Cancel</button>
        </div>
      ))}
    </div>
  );
}
