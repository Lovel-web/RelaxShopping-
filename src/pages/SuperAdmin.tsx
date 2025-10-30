import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, updateDoc, doc, query, where } from "firebase/firestore";

export default function SuperAdmin() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const unsub = onSnapshot(q, (snap) => {
      setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const approveAdmin = async (id: string) => {
    await updateDoc(doc(db, "users", id), { approved: true });
    alert("✅ Admin approved!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Super Admin Panel</h1>
      {admins.map((a) => (
        <div key={a.id} className="border p-3 my-2 rounded">
          <p><strong>{a.fullName}</strong> — {a.state}</p>
          <p>Status: {a.approved ? "✅ Approved" : "❌ Pending"}</p>
          {!a.approved && (
            <button onClick={() => approveAdmin(a.id)} className="bg-green-600 text-white px-4 py-2 mt-2 rounded">
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
