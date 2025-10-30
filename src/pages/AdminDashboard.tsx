import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminDashboard() {
  const [state, setState] = useState("");
  const [lgaName, setLgaName] = useState("");
  const [estateName, setEstateName] = useState("");
  const [lgas, setLgas] = useState([]);
  const [estates, setEstates] = useState([]);
  const [selectedLGA, setSelectedLGA] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await (await import("firebase/firestore")).getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();
        if (data?.role === "admin" && data.approved) setState(data.state);
        else alert("Not authorized or not approved yet.");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!state) return;
    const q = query(collection(db, "lgas"), where("state", "==", state));
    const unsub = onSnapshot(q, (snap) => setLgas(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [state]);

  useEffect(() => {
    if (!selectedLGA) return;
    const q = query(collection(db, "estates"), where("lgaId", "==", selectedLGA));
    const unsub = onSnapshot(q, (snap) => setEstates(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [selectedLGA]);

  async function addLGA() {
    if (!lgaName) return alert("Enter LGA name");
    await addDoc(collection(db, "lgas"), { name: lgaName, state });
    setLgaName("");
  }

  async function addEstate() {
    if (!selectedLGA || !estateName) return alert("Select LGA and enter Estate name");
    await addDoc(collection(db, "estates"), { name: estateName, lgaId: selectedLGA, state });
    setEstateName("");
  }

  async function deleteLGA(id) {
    await deleteDoc(doc(db, "lgas", id));
  }

  async function deleteEstate(id) {
    await deleteDoc(doc(db, "estates", id));
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">{state} Admin Dashboard</h1>

      <div className="border p-4 rounded mb-6">
        <h2>Add LGA</h2>
        <input value={lgaName} onChange={(e) => setLgaName(e.target.value)} placeholder="LGA Name" className="border p-2 w-full" />
        <button onClick={addLGA} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">Add</button>
      </div>

      <h3>LGAs</h3>
      {lgas.map((l) => (
        <div key={l.id} className="p-2 border flex justify-between">
          <span onClick={() => setSelectedLGA(l.id)}>{l.name}</span>
          <button onClick={() => deleteLGA(l.id)}>❌</button>
        </div>
      ))}

      {selectedLGA && (
        <div className="border p-4 rounded mt-6">
          <h2>Add Estate/Hotel</h2>
          <input value={estateName} onChange={(e) => setEstateName(e.target.value)} placeholder="Estate Name" className="border p-2 w-full" />
          <button onClick={addEstate} className="bg-green-600 text-white px-4 py-2 mt-2 rounded">Add</button>

          <h3>Estates in selected LGA</h3>
          {estates.map((e) => (
            <div key={e.id} className="p-2 border flex justify-between">
              <span>{e.name}</span>
              <button onClick={() => deleteEstate(e.id)}>❌</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
          }
