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
  const [stateName, setStateName] = useState("");
  const [lgaName, setLgaName] = useState("");
  const [estateName, setEstateName] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [lgas, setLgas] = useState<any[]>([]);
  const [estates, setEstates] = useState<any[]>([]);

  // ✅ Check if logged-in user is admin
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const res = await fetch(
          `https://firestore.googleapis.com/v1/projects/${
            import.meta.env.VITE_FIREBASE_PROJECT_ID
          }/databases/(default)/documents/users/${currentUser.uid}`
        );
        const data = await res.json();
        const role = data.fields?.role?.stringValue;
        if (role === "admin") setUser(currentUser);
        else alert("Access Denied: You must be an admin to view this page.");
      } else {
        alert("Please login first.");
      }
    });
    return () => unsub();
  }, []);

  // ✅ Fetch LGAs created by this admin
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "lgas"), where("stateAdminId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setLgas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  // ✅ Fetch Estates linked to selected LGA
  useEffect(() => {
    if (!selectedLGA) return;
    const q = query(collection(db, "estates"), where("lgaId", "==", selectedLGA));
    const unsub = onSnapshot(q, (snapshot) => {
      setEstates(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [selectedLGA]);

  // ➕ Add new LGA
  async function addLGA() {
    if (!stateName || !lgaName) return alert("Enter both state and LGA name");
    await addDoc(collection(db, "lgas"), {
      name: lgaName,
      state: stateName,
      stateAdminId: user.uid,
      createdAt: new Date(),
    });
    alert(`✅ LGA "${lgaName}" added successfully under ${stateName}!`);
    setLgaName("");
  }

  // ➕ Add new Estate
  async function addEstate() {
    if (!estateName || !selectedLGA)
      return alert("Select an LGA and enter Estate/Hotel name");
    await addDoc(collection(db, "estates"), {
      name: estateName,
      lgaId: selectedLGA,
      createdAt: new Date(),
    });
    alert(`✅ Estate/Hotel "${estateName}" added successfully!`);
    setEstateName("");
  }

  // ❌ Delete LGA
  async function deleteLGA(id: string) {
    if (
      !confirm(
        "Delete this LGA? (This will not delete its linked Estates automatically.)"
      )
    )
      return;
    await deleteDoc(doc(db, "lgas", id));
  }

  // ❌ Delete Estate
  async function deleteEstate(id: string) {
    if (!confirm("Delete this Estate/Hotel?")) return;
    await deleteDoc(doc(db, "estates", id));
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🏛️ Admin Dashboard</h1>

      {/* Add new LGA */}
      <div className="mb-8 border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">➕ Add New LGA</h2>
        <input
          type="text"
          placeholder="Enter State Name (e.g. Ondo)"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
        <input
          type="text"
          placeholder="Enter LGA Name (e.g. Akure South)"
          value={lgaName}
          onChange={(e) => setLgaName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={addLGA}
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded w-full"
        >
          Add LGA
        </button>
      </div>

      {/* Display LGAs */}
      <div className="mb-8 border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">📍 Existing LGAs</h2>
        {lgas.length === 0 && <p>No LGAs added yet.</p>}
        {lgas.map((lga) => (
          <div
            key={lga.id}
            className="flex justify-between p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedLGA(lga.id)}
          >
            <span>
              {lga.name} ({lga.state})
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteLGA(lga.id);
              }}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Estate/Hotel */}
      {selectedLGA && (
        <div className="mb-8 border p-4 rounded-lg">
          <h2 className="font-semibold mb-2">🏘️ Add Estate/Hotel under Selected LGA</h2>
          <input
            type="text"
            placeholder="Enter Estate or Hotel Name"
            value={estateName}
            onChange={(e) => setEstateName(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={addEstate}
            className="bg-green-600 text-white px-4 py-2 mt-2 rounded w-full"
          >
            Add Estate / Hotel
          </button>
        </div>
      )}

      {/* List Estates */}
      {estates.length > 0 && (
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold mb-2">🏨 Estates / Hotels in Selected LGA</h2>
          {estates.map((e) => (
            <div
              key={e.id}
              className="flex justify-between p-2 border-b"
            >
              <span>{e.name}</span>
              <button onClick={() => deleteEstate(e.id)} className="text-red-500">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
                                         }
