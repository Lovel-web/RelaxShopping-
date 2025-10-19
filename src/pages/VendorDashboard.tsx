import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function VendorDashboard() {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "products"), {
        name: productName,
        price: parseFloat(price),
        image: imageUrl,
        vendorId: user.uid,
        lga: user.lga,
        createdAt: new Date(),
      });
      toast.success("Product added!");
      setProductName('');
      setPrice('');
      setImageUrl('');
    } catch (error) {
      toast.error("Error adding product");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
      <form onSubmit={handleAddProduct} className="space-y-4">
        <div>
          <Label>Product Name</Label>
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} required />
        </div>
        <div>
          <Label>Price (₦)</Label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" required />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <Button type="submit">Add Product</Button>

<div className="mt-6 border-t pt-4">
  <h2 className="text-lg font-semibold mb-2">Bulk Upload (CSV / POS File)</h2>
  <input
    type="file"
    accept=".csv"
    onChange={handleCSVUpload}
    className="block w-full text-sm text-muted-foreground border border-dashed p-2 rounded-md"
  />
  <p className="text-xs mt-1 text-muted-foreground">
    Upload a CSV with columns: name, price, image
  </p>
</div>
      </form>
    </div>
  );
}
