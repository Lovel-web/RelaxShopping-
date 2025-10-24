import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [adminState, setAdminState] = useState("");
  const [lgaName, setLgaName] = useState("");
  const [estateName, setEstateName] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [lgas, setLgas] = useState<any[]>([]);
  const [estates, setEstates] = useState<any[]>([]);

  // ✅ Step 1: Check if logged-in user is admin and get their state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.role === "admin") {
            setUser(currentUser);
            setAdminState(data.state || ""); // The state admin manages
          } else {
            alert("Access Denied: Only state admins can view this page.");
          }
        } else {
          alert("User data not found.");
        }
      } else {
        alert("Please login first.");
      }
    });
    return () => unsub();
  }, []);

  // ✅ Step 2: Fetch LGAs for the admin’s state
  useEffect(() => {
    if (!user || !adminState) return;
    const q = query(collection(db, "lgas"), where("state", "==", adminState));
    const unsub = onSnapshot(q, (snapshot) => {
      setLgas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user, adminState]);

  // ✅ Step 3: Fetch Estates/Hotels for selected LGA
  useEffect(() => {
    if (!selectedLGA) return;
    const q = query(collection(db, "estates"), where("lgaId", "==", selectedLGA));
    const unsub = onSnapshot(q, (snapshot) => {
      setEstates(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [selectedLGA]);

  // ✅ Add new LGA under this admin's state
  async function addLGA() {
    if (!lgaName) return alert("Enter LGA name");
    await addDoc(collection(db, "lgas"), {
      name: lgaName,
      state: adminState,
      stateAdminId: user.uid,
      createdAt: new Date(),
    });
    alert(`✅ LGA "${lgaName}" added successfully for ${adminState} State.`);
    setLgaName("");
  }

  // ✅ Add new Estate/Hotel under selected LGA
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

  // 🗑️ Delete LGA
  async function deleteLGA(id: string) {
    if (!confirm("Delete this LGA? (Linked estates will remain.)")) return;
    await deleteDoc(doc(db, "lgas", id));
  }

  // 🗑️ Delete Estate/Hotel
  async function deleteEstate(id: string) {
    if (!confirm("Delete this Estate/Hotel?")) return;
    await deleteDoc(doc(db, "estates", id));
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🏛️ {adminState || "State"} Admin Dashboard</h1>

      {/* Add LGA */}
      <div className="mb-8 border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">➕ Add New LGA</h2>
        <input
          type="text"
          placeholder={`Enter LGA name for ${adminState || "your state"}`}
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
        <h2 className="font-semibold mb-2">📍 LGAs in {adminState}</h2>
        {lgas.length === 0 && <p>No LGAs added yet.</p>}
        {lgas.map((lga) => (
          <div
            key={lga.id}
            className="flex justify-between p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedLGA(lga.id)}
          >
            <span>{lga.name}</span>
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
          <h2 className="font-semibold mb-2">🏘️ Add Estate/Hotel</h2>
          <input
            type="text"
            placeholder="Enter Estate or Hotel name"
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
            <div key={e.id} className="flex justify-between p-2 border-b">
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
