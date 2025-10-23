// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [lgaName, setLgaName] = useState("");
  const [estateName, setEstateName] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [lgas, setLgas] = useState<any[]>([]);
  const [estates, setEstates] = useState<any[]>([]);

  // Check if logged-in user is admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user doc via REST to get role quickly (or use Firestore getDoc)
        const res = await fetch(
          `https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${currentUser.uid}`
        );
        const data = await res.json();
        const role = data.fields?.role?.stringValue;
        if (role === "admin") setUser(currentUser);
        else {
          alert("Access Denied: You must be an admin to view this page.");
        }
      } else {
        alert("Please login first.");
      }
    });
    return () => unsub();
  }, []);

  // Fetch LGAs for the admin’s state (only LGAs that this admin created)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "lgas"), where("stateAdminId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setLgas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  // Fetch Estates/Hotels for selected LGA
  useEffect(() => {
    if (!selectedLGA) return;
    const q = query(collection(db, "estates"), where("lgaId", "==", selectedLGA));
    const unsub = onSnapshot(q, (snapshot) => {
      setEstates(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [selectedLGA]);

  async function addLGA() {
    if (!lgaName) return alert("Enter LGA name");
    await addDoc(collection(db, "lgas"), {
      name: lgaName,
      stateAdminId: user.uid,
      createdAt: new Date(),
    });
    setLgaName("");
  }

  async function addEstate() {
    if (!estateName || !selectedLGA)
      return alert("Select LGA and enter Estate name");
    await addDoc(collection(db, "estates"), {
      name: estateName,
      lgaId: selectedLGA,
      createdAt: new Date(),
    });
    setEstateName("");
  }

  async function deleteLGA(id: string) {
    if (!confirm("Delete this LGA? This will not delete linked estates automatically.")) return;
    await deleteDoc(doc(db, "lgas", id));
    // Optionally you may delete linked estates in code (not done here).
  }

  async function deleteEstate(id: string) {
    if (!confirm("Delete this Estate/Hotel?")) return;
    await deleteDoc(doc(db, "estates", id));
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏛️ State Admin Dashboard</h1>

      {/* Add new LGA */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Add LGA</h2>
        <input
          type="text"
          placeholder="Enter LGA name"
          value={lgaName}
          onChange={(e) => setLgaName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button onClick={addLGA} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
          Add LGA
        </button>
      </div>

      {/* Display LGAs */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Existing LGAs</h2>
        {lgas.map((lga) => (
          <div key={lga.id} className="flex justify-between p-2 border mb-1 rounded">
            <span onClick={() => setSelectedLGA(lga.id)} className="cursor-pointer">
              📍 {lga.name}
            </span>
            <button onClick={() => deleteLGA(lga.id)} className="text-red-500">Delete</button>
          </div>
        ))}
      </div>

      {/* Add estate/hotel */}
      {selectedLGA && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Add Estate/Hotel for Selected LGA</h2>
          <input
            type="text"
            placeholder="Enter Estate or Hotel name"
            value={estateName}
            onChange={(e) => setEstateName(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button onClick={addEstate} className="bg-green-600 text-white px-4 py-2 mt-2 rounded">
            Add Estate/Hotel
          </button>
        </div>
      )}

      {/* List estates */}
      {estates.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">Estates/Hotels in Selected LGA</h2>
          {estates.map((e) => (
            <div key={e.id} className="flex justify-between p-2 border mb-1 rounded">
              <span>{e.name}</span>
              <button onClick={() => deleteEstate(e.id)} className="text-red-500">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
                 }
