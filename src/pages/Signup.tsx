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

  // State data
  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<any[]>([]);
  const [estates, setEstates] = useState<any[]>([]);

  // ✅ Fetch states dynamically from LGAs collection
  useEffect(() => {
    async function fetchStates() {
      try {
        const snap = await getDocs(collection(db, "lgas"));
        const uniqueStates = Array.from(new Set(snap.docs.map((doc) => doc.data().state)));
        setStates(uniqueStates);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    }
    fetchStates();
  }, []);

  // ✅ Fetch LGAs when state is selected
  useEffect(() => {
    async function fetchLGAs() {
      if (!formData.state) return;
      try {
        const q = query(collection(db, "lgas"), where("state", "==", formData.state));
        const snap = await getDocs(q);
        setLgas(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching LGAs:", err);
      }
    }
    fetchLGAs();
  }, [formData.state]);

  // ✅ Fetch Estates/Hotels when an LGA is selected
  useEffect(() => {
    async function fetchEstates() {
      if (!formData.lga) return;
      try {
        const q = query(collection(db, "estates"), where("lgaId", "==", formData.lga));
        const snap = await getDocs(q);
        setEstates(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching Estates:", err);
      }
    }
    fetchEstates();
  }, [formData.lga]);

  // ✅ Handle Signup
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        state: formData.state,
        lga: formData.lga,
        estate: formData.estate,
        shopName: formData.role === "vendor" ? formData.shopName : "",
        createdAt: new Date(),
      });

      alert("✅ Account created successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("❌ Error creating account. Please try again.");
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        {/* Full name */}
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        {/* Role */}
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="staff">Staff</option>
        </select>

        {/* Vendor only: Shop Name */}
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

        {/* ✅ State Dropdown */}
        <select
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value, lga: "", estate: "" })}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* ✅ LGA Dropdown */}
        {formData.state && (
          <select
            value={formData.lga}
            onChange={(e) => setFormData({ ...formData, lga: e.target.value, estate: "" })}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select LGA</option>
            {lgas.map((lga) => (
              <option key={lga.id} value={lga.id}>
                {lga.name}
              </option>
            ))}
          </select>
        )}

        {/* ✅ Estate/Hotel Dropdown */}
        {formData.lga && (
          <select
            value={formData.estate}
            onChange={(e) => setFormData({ ...formData, estate: e.target.value })}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Estate / Hotel</option>
            {estates.map((estate) => (
              <option key={estate.id} value={estate.name}>
                {estate.name}
              </option>
            ))}
          </select>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
            }
