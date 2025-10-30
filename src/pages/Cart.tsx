// src/pages/Cart.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items = [], subtotal = 0 } = useCart ? useCart() : { items: [], subtotal: 0 };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <Link to="/shops" className="text-blue-600 underline">Browse shops</Link>
        </div>
      ) : (
        <>
          {items.map((it, i) => (
            <div key={i} className="flex justify-between py-2 border-b">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">
                  {it.qty} × ₦{it.price.toLocaleString()}
                </div>
              </div>
              <div>₦{(it.qty * it.price).toLocaleString()}</div>
            </div>
          ))}
          <div className="mt-4 font-bold">Subtotal: ₦{subtotal.toLocaleString()}</div>
          <Link
            to="/checkout"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded"
          >
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
}
