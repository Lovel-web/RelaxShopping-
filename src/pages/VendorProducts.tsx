// src/pages/VendorProducts.tsx
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Papa from "papaparse";
import { toast } from "sonner";

export default function VendorProducts() {
  const { profile } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Manual Upload
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return toast.error("Please log in first.");
    if (!name || !price) return toast.error("Name and price are required.");

    setLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
        unit: unit || "1 pc",
        image: image || "/placeholder.svg",
        vendorId: profile.uid,
        vendorEmail: profile.email,
        lga: profile.lga,
        state: profile.state,
        createdAt: new Date(),
      });

      toast.success("Product added successfully!");
      setName("");
      setPrice("");
      setUnit("");
      setImage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product.");
    }
    setLoading(false);
  };

  // POS File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const products = results.data as any[];
        try {
          for (const item of products) {
            await addDoc(collection(db, "products"), {
              name: item.name,
              price: parseFloat(item.price),
              unit: item.unit || "1 pc",
              image: item.image || "/placeholder.svg",
              vendorId: profile.uid,
              vendorEmail: profile.email,
              lga: profile.lga,
              state: profile.state,
              createdAt: new Date(),
            });
          }
          toast.success("POS File Imported Successfully!");
        } catch (err) {
          console.error(err);
          toast.error("Import failed, check your file format.");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Vendor Product Management</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Add or upload products visible to customers in your assigned LGA.
        </p>

        {/* Manual Upload Form */}
        <form onSubmit={handleAddProduct} className="space-y-4 mb-6">
          <div>
            <Label>Product Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Rice 10kg" required />
          </div>

          <div>
            <Label>Price (₦)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div>
            <Label>Unit</Label>
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g., 1 bag, 1 pack" />
          </div>

          <div>
            <Label>Image URL (optional)</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>

        {/* CSV Upload */}
        <div>
          <Label>Upload POS / CSV File</Label>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <p className="text-xs text-muted-foreground mt-1">
            CSV columns: name, price, unit, image (optional)
          </p>
        </div>
      </Card>
    </div>
  );
}
