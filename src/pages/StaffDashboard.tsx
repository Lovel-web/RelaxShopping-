import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function StaffDashboard({ lga }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const q = query(collection(db, "orders"), where("lga", "==", lga));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => doc.data()));
    };
    loadOrders();
  }, [lga]);

  return (
    <div>
      <h3>Orders for {lga}</h3>
      {orders.map((o, i) => (
        <div key={i}>
          <p>{o.orderCode} — {o.status}</p>
        </div>
      ))}
    </div>
  );
}
