// src/pages/StaffDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StaffDashboard() {
  const { profile, firebaseUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const staffLga = profile?.lga;

  useEffect(() => {
    if (!firebaseUser) return;
    if (!staffLga) return; // still loading or not assigned
    const q = query(collection(db, "orders"), where("lga", "==", staffLga));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [firebaseUser, staffLga]);

  async function updateStatus(orderId: string, status: string) {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  }

  if (!firebaseUser) return <div className="p-6">Please log in as staff to view orders.</div>;
  if (!staffLga) return <div className="p-6">No LGA assigned. Contact admin.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Orders for {staffLga}</h1>
      {orders.length === 0 ? <p>No orders for this LGA yet.</p> : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="border p-3 rounded flex justify-between">
              <div>
                <div><strong>Order:</strong> {o.orderCode || o.id}</div>
                <div><strong>Customer:</strong> {o.userName || o.userEmail}</div>
                <div><strong>Items:</strong> {o.items?.length || 0}</div>
                <div><strong>Status:</strong> {o.status}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => updateStatus(o.id, "Processing")}>Mark Processing</Button>
                <Button onClick={() => updateStatus(o.id, "Out for Delivery")}>Out for Delivery</Button>
                <Button variant="destructive" onClick={() => updateStatus(o.id, "Cancelled")}>Cancel</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
