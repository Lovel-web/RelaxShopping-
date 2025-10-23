import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Mock states and LGAs for now (admin will manage these later)
const statesAndLGAs = {
  "Lagos": ["Ikeja", "Lekki", "Surulere"],
  "Ondo": ["Akure South", "Akure North"],
  "Abuja": ["Garki", "Maitama"]
};

// Mock estates/hotels — these will be added by state admins later
const estateOptions = {
  "Ikeja": ["GRA Estate", "Maryland Hotel"],
  "Lekki": ["Orchid Estate", "Lighthouse Hotel"],
  "Akure South": ["Ijapo Estate", "Sunview Hotel"],
  "Garki": ["Area 11 Estate", "Grand Hotel"]
};

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

      alert("Account created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating account. Please try again.");
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        {/* Role selection */}
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="staff">Staff</option>
        </select>

        {/* Vendor only: shop name */}
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

        {/* State selection */}
        <select
          value={formData.state}
          onChange={(e) => {
            const selectedState = e.target.value;
            setFormData({
              ...formData,
              state: selectedState,
              lga: "",
              estate: "",
            });
          }}
          className="border p-2 w-full rounded"
        >
          <option value="">Select State</option>
          {Object.keys(statesAndLGAs).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        {/* LGA selection */}
        {formData.state && (
          <select
            value={formData.lga}
            onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="">Select LGA</option>
            {statesAndLGAs[formData.state].map((lga) => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>
        )}

        {/* Estate/hotel selection */}
        {formData.lga && (
          <select
            value={formData.estate}
            onChange={(e) => setFormData({ ...formData, estate: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Estate/Hotel</option>
            {(estateOptions[formData.lga] || []).map((estate) => (
              <option key={estate} value={estate}>{estate}</option>
            ))}
          </select>
        )}

        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
            }
