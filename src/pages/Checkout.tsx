import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext"; // if your app has CartContext
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Checkout() {
  const { cartItems, totalPrice } = useCart(); // from your cart context
  const [user, setUser] = useState<any>(null);
  const [slot, setSlot] = useState("10AM");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const DELIVERY_FEE = 400;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate("/signup");
    });
    return unsubscribe;
  }, [navigate]);

  async function handlePaystackPayment() {
    if (!user) return alert("Please log in first.");
    setLoading(true);

    const totalAmount = totalPrice + DELIVERY_FEE;
    const orderId = "RS" + Date.now(); // Unique order ID

    try {
      // Save order to Firestore first
      await setDoc(doc(db, "orders", orderId), {
        userId: user.uid,
        items: cartItems,
        total: totalAmount,
        deliveryFee: DELIVERY_FEE,
        batchSlot: slot,
        paymentStatus: "pending",
        createdAt: new Date(),
      });

      // Initialize payment via Netlify function
      const res = await fetch("/.netlify/functions/paystack-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          amount: totalAmount,
          orderId,
          metadata: { callbackUrl: window.location.origin + "/order-success" },
        }),
      });

      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert("Failed to start payment. Try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="border p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Your Items</h2>
        {cartItems?.length ? (
          cartItems.map((item: any, index: number) => (
            <div key={index} className="flex justify-between border-b py-1">
              <span>{item.name}</span>
              <span>₦{item.price}</span>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="border p-4 rounded mb-4">
        <p>Subtotal: ₦{totalPrice}</p>
        <p>Delivery Fee: ₦{DELIVERY_FEE}</p>
        <p className="font-bold">Total: ₦{totalPrice + DELIVERY_FEE}</p>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select Delivery Time:</label>
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="10AM">10AM</option>
          <option value="1PM">1PM</option>
          <option value="4PM">4PM</option>
        </select>
      </div>

      <button
        onClick={handlePaystackPayment}
        disabled={loading}
        className="bg-green-600 text-white p-3 w-full rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
          }
