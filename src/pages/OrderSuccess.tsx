export default function OrderSuccess() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-700">✅ Payment Successful!</h1>
      <p className="mt-4">Your order has been placed. Thank you for shopping with RelaxShopping.</p>
      <a href="/" className="text-blue-600 underline mt-4 inline-block">Back to Home</a>
    </div>
  );
}
