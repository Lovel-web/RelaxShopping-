// src/pages/Cart.tsx
import React from "react";
import { useCart } from "@/contexts/CartContext"; // if you have it
import { Link } from "react-router-dom";

export default function Cart() {
  // if you don't have a CartContext, implement a simple placeholder
  const { items = [], subtotal = 0 } = useCart ? useCart() : { items: [], subtotal: 0 };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/shops" className="text-primary">Browse shops</Link>
        </div>
      ) : (
        <div>
          {items.map((it, i) => (
            <div key={i} className="flex justify-between py-2 border-b">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">{it.qty} × ₦{it.price}</div>
              </div>
              <div>₦{it.qty * it.price}</div>
            </div>
          ))}
          <div className="mt-4 font-bold">Subtotal: ₦{subtotal}</div>
        </div>
      )}
    </div>
  );
}
