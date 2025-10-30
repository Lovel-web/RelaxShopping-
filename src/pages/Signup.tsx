// src/pages/Signup.tsx
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    state: "",
    lga: "",
    estate: "",
    shopName: "",
  });

  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<any[]>([]);
  const [estates, setEstates] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStates() {
      const snap = await getDocs(collection(db, "lgas"));
      const uniqueStates = Array.from(new Set(snap.docs.map((d) => d.data().state)));
      setStates(uniqueStates);
    }
    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchLGAs() {
      if (!formData.state) return;
      const q = query(collection(db, "lgas"), where("state", "==", formData.state));
      const snap = await getDocs(q);
      setLgas(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchLGAs();
  }, [formData.state]);

  useEffect(() => {
    async function fetchEstates() {
      if (!formData.lga) return;
      const q = query(collection(db, "estates"), where("lgaId", "==", formData.lga));
      const snap = await getDocs(q);
      setEstates(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchEstates();
  }, [formData.lga]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        state: formData.state,
        lga: formData.lga,
        estate: formData.estate,
        shopName: formData.role === "vendor" ? formData.shopName : "",
        approved: formData.role === "admin" ? false : true,
        createdAt: new Date(),
      });
      alert("✅ Account created successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create account");
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input type="text" placeholder="Full Name" required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input type="email" placeholder="Email" required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input type="password" placeholder="Password" required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin (State)</option>
        </select>
        {formData.role === "vendor" && (
          <input
            type="text"
            placeholder="Shop Name"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
        )}
        {/* state / lga / estate dropdowns same as before */}
        {/* Submit */}
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
                                                        }
