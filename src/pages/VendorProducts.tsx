import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Papa from 'papaparse';
import { toast } from 'sonner';

export default function VendorProducts() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  // manual upload
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in first.');
      return;
    }
    if (!name || !price) {
      toast.error('Name and price are required.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        unit: unit || '1 pc',
        image: image || '/placeholder.svg',
        vendorId: user.uid,
        vendorEmail: user.email,
        lga: user.lga,
        state: user.state,
        createdAt: new Date(),
      });

      toast.success('Product added successfully!');
      setName('');
      setPrice('');
      setUnit('');
      setImage('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add product.');
    }
    setLoading(false);
  };

  // POS file import (CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (!user) {
          toast.error('Please log in first.');
          return;
        }

        const products = results.data as any[];

        try {
          for (const item of products) {
            await addDoc(collection(db, 'products'), {
              name: item.name,
              price: parseFloat(item.price),
              unit: item.unit || '1 pc',
              image: item.image || '/placeholder.svg',
              vendorId: user.uid,
              vendorEmail: user.email,
              lga: user.lga,
              state: user.state,
              createdAt: new Date(),
            });
          }
          toast.success('POS File Imported Successfully!');
        } catch (err) {
          console.error(err);
          toast.error('Import failed, check your file.');
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Vendor Product Management</h1>
        <p className="text-sm text-muted-foreground mb-4">
          You can manually add products or upload from your POS file (CSV).
        </p>

        {/* Manual Upload Form */}
        <form onSubmit={handleAddProduct} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Milk 1L"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₦)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 1200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., 1 pack, 1 kg, 1 bottle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://your-image-link.jpg"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </form>

        {/* POS File Upload */}
        <div className="space-y-2">
          <Label htmlFor="posFile">Upload POS (CSV File)</Label>
          <Input id="posFile" type="file" accept=".csv" onChange={handleFileUpload} />
          <p className="text-xs text-muted-foreground">
            CSV columns must be: name, price, unit, image (optional)
          </p>
        </div>
      </Card>
    </div>
  );
              }
