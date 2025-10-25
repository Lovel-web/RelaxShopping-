import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function AdminPayments() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const confirmPayment = async (id: string) => {
    await updateDoc(doc(db, "orders", id), { status: "Confirmed" });
    alert("Payment confirmed ✅");
  };

  const refundPayment = async (id: string) => {
    await updateDoc(doc(db, "orders", id), { status: "Refunded" });
    alert("Refund processed 🔁");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💰 Admin Payment Dashboard</h1>
      {orders.map((o) => (
        <div key={o.id} className="border p-3 mb-2 rounded">
          <p><b>Order ID:</b> {o.id}</p>
          <p><b>Vendor:</b> {o.vendorName}</p>
          <p><b>Customer:</b> {o.customerName}</p>
          <p><b>Amount:</b> ₦{o.amount}</p>
          <p><b>Status:</b> {o.status}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => confirmPayment(o.id)} className="bg-green-500 text-white px-3 py-1 rounded">Confirm</button>
            <button onClick={() => refundPayment(o.id)} className="bg-red-500 text-white px-3 py-1 rounded">Refund</button>
          </div>
        </div>
      ))}
    </div>
  );
}
