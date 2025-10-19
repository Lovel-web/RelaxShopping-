import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ordersSnap = await getDocs(collection(db, "orders"));
      const vendorsSnap = await getDocs(collection(db, "vendors"));
      setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setVendors(vendorsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const handleConfirmPayment = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), { status: "confirmed" });
    toast.success("Payment confirmed and sent to vendor!");
  };

  const handleRefund = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), { status: "refunded" });
    toast.success("Refund issued successfully.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-lg font-semibold mt-4">Pending Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-3 my-2 rounded-md">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleConfirmPayment(order.id)}>Confirm Payment</Button>
              <Button variant="destructive" onClick={() => handleRefund(order.id)}>Refund</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
