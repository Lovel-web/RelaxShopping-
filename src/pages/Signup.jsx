import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    state: "",
    lga: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Create user in Firebase Authentication
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 2️⃣ Get the user’s unique ID
      const uid = userCred.user.uid;

      // 3️⃣ Save user info in Firestore
      await setDoc(doc(db, "users", uid), {
        uid,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        state: form.state,
        lga: form.lga,
        role: form.role,
        createdAt: new Date(),
      });

      alert("✅ Account created successfully!");
    } catch (error) {
      console.error("Signup Error:", error.message);
      alert("❌ " + error.message);
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>RelaxShopping – Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="Phone (+234...)"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="State"
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          placeholder="LGA"
          onChange={(e) => setForm({ ...form, lga: e.target.value })}
        />

        <select
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
