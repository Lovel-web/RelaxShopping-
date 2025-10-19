import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WorkerDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    await updateDoc(doc(db, "orders", id), { status: "delivered" });
    toast.success("Order marked as delivered!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Worker Dashboard</h1>
      {orders.length === 0 ? (
        <p>No orders to process.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-3 my-2 rounded-md">
            <p><strong>ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <Button onClick={() => markDelivered(order.id)}>Mark Delivered</Button>
          </div>
        ))
      )}
    </div>
  );
}
