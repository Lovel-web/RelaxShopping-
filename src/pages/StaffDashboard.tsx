// src/pages/StaffDashboard.tsx
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [lga, setLga] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const data = userSnap.data();
      setLga(data?.lga || "");
      if (!data?.lga) return;

      const q = query(collection(db, "orders"), where("lga", "==", data.lga));
      const unsubOrders = onSnapshot(q, (snap) =>
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
      return unsubOrders;
    });
    return () => unsub();
  }, []);

  async function markDelivered(id: string) {
    await updateDoc(doc(db, "orders", id), { status: "delivered" });
  }

  async function cancelOrder(id: string) {
    await updateDoc(doc(db, "orders", id), { status: "cancelled" });
  }

  if (!lga) return <div className="p-6">Loading your LGA data...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard – {lga}</h1>
      {orders.length === 0 ? (
        <p>No orders found in your LGA.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="border p-3 my-2 rounded">
            <p>Order ID: {o.id}</p>
            <p>Status: {o.status}</p>
            <button onClick={() => markDelivered(o.id)} className="bg-green-600 text-white px-3 py-1 rounded">Delivered</button>
            <button onClick={() => cancelOrder(o.id)} className="bg-red-600 text-white px-3 py-1 ml-2 rounded">Cancel</button>
          </div>
        ))
      )}
    </div>
  );
}
