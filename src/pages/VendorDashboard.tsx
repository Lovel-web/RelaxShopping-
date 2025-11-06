// src/pages/VendorDashboard.tsx
import { useEffect, useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * Vendor Dashboard
 * - Vendors can edit profile (logo, storeName, bank info)
 * - Add products with image file picker (saved as Base64 in Firestore)
 * - Products listed with preview + delete
 *
 * Notes:
 * - Bank details are displayed only when current viewer role is "admin" or "staff"
 *   (UI enforcement). Make sure Firestore rules below also enforce server-side.
 */

type Product = {
  id?: string;
  name: string;
  price: number;
  imageBase64?: string;
  createdAt?: any;
};

export default function VendorDashboard() {
  const { user: currentUser, userProfile } = useAuth(); // userProfile expected to have role, email, etc.
  const [loading, setLoading] = useState(false);

  // Vendor profile state
  const [profile, setProfile] = useState<any>({
    storeName: "",
    name: "",
    email: "",
    state: "",
    lga: "",
    estate: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    logoBase64: "",
  });

  // Product form
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number | "">("");
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);

  // Product list
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch vendor profile and products
  useEffect(() => {
    async function loadVendorData() {
      if (!currentUser) return;

      setLoading(true);
      try {
        // Load vendor profile from `vendors` collection by uid
        const vendorQuery = query(
          collection(db, "vendors"),
          where("uid", "==", currentUser.uid)
        );
        const vendorSnap = await getDocs(vendorQuery);
        if (!vendorSnap.empty) {
          const v = vendorSnap.docs[0].data();
          setProfile({ ...v, id: vendorSnap.docs[0].id });
        } else {
          // No vendor doc yet — create stub (optional)
          // We'll just set email/name from auth
          setProfile((p: any) => ({
            ...p,
            email: currentUser.email || "",
            name: currentUser.displayName || "",
            uid: currentUser.uid,
          }));
        }

        // Load products for this vendor
        const productsQ = query(collection(db, "products"), where("vendorUid", "==", currentUser.uid));
        const prodSnap = await getDocs(productsQ);
        setProducts(prodSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      } catch (err: any) {
        console.error("Load vendor error", err);
        toast.error("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    }
    loadVendorData();
  }, [currentUser]);

  // File -> Base64 conversion helper
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Logo upload for vendor profile
  async function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      // Recommend <2MB
      toast("Try a smaller image (<2MB) for faster loads.", { type: "warning" });
    }
    try {
      setLoading(true);
      const base64 = await fileToBase64(file);
      setProfile((p: any) => ({ ...p, logoBase64: base64 }));
      // Save to vendors collection (upsert)
      await saveVendorProfile({ logoBase64: base64 });
      toast.success("Logo updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload logo");
    } finally {
      setLoading(false);
    }
  }

  // Product image change (preview only, saved when product is created)
  async function handleProductImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 3_000_000) {
        toast("Large image detected — consider resizing to <3MB for speed", { type: "warning" });
      }
      const base64 = await fileToBase64(file);
      setProductImagePreview(base64);
    } catch (err) {
      console.error(err);
      toast.error("Failed to read image");
    }
  }

  // Save vendor profile to Firestore (create or update)
  async function saveVendorProfile(patch: Partial<any> = {}) {
    if (!currentUser) return;
    const vendorsRef = collection(db, "vendors");
    const vendorQuery = query(vendorsRef, where("uid", "==", currentUser.uid));
    const snap = await getDocs(vendorQuery);

    const dataToSave = {
      ...profile,
      ...patch,
      uid: currentUser.uid,
      email: profile.email || currentUser.email,
      updatedAt: serverTimestamp(),
    };

    if (!snap.empty) {
      const id = snap.docs[0].id;
      await updateDoc(doc(db, "vendors", id), { ...dataToSave });
    } else {
      await addDoc(vendorsRef, { ...dataToSave, createdAt: serverTimestamp() });
    }
  }

  // Create product (saves product image as Base64)
  async function handleAddProduct(e?: any) {
    if (e) e.preventDefault();
    if (!productName.trim() || !productPrice) {
      toast.error("Enter product name and price");
      return;
    }
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: productName.trim(),
        price: Number(productPrice),
        imageBase64: productImagePreview || null,
        vendorUid: currentUser?.uid,
        vendorId: profile?.id || null,
        createdAt: serverTimestamp(),
      });
      // Append to local state
      setProducts((p) => [{ id: docRef.id, name: productName.trim(), price: Number(productPrice), imageBase64: productImagePreview }, ...p]);
      // reset form
      setProductName("");
      setProductPrice("");
      setProductImagePreview(null);
      toast.success("Product added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id?: string) {
    if (!id) return;
    const ok = confirm("Delete this product?");
    if (!ok) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  // Check viewer role to show bank details (UI-level)
  const viewerRole = userProfile?.role || "customer";
  const showBankToViewer = viewerRole === "admin" || viewerRole === "staff";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold mb-6 text-center">
        Vendor Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Profile Card */}
        <motion.section layout className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-pink-300 to-yellow-200 flex items-center justify-center">
              {profile.logoBase64 ? (
                <img src={profile.logoBase64} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-sm text-gray-700">No logo</div>
              )}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-lg">{profile.storeName || "Your Store Name"}</div>
              <div className="text-sm text-muted-foreground">{profile.email}</div>
              <div className="text-xs text-muted-foreground mt-1">{profile.state} • {profile.lga} • {profile.estate}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm font-medium">Store Name</span>
              <Input value={profile.storeName || ""} onChange={(e) => setProfile((p:any) => ({ ...p, storeName: e.target.value }))} />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Display Name</span>
              <Input value={profile.name || ""} onChange={(e) => setProfile((p:any) => ({ ...p, name: e.target.value }))} />
            </label>

            <label className="block">
              <span className="text-sm font-medium">State</span>
              <Input value={profile.state || ""} onChange={(e) => setProfile((p:any) => ({ ...p, state: e.target.value }))} />
            </label>

            <label className="block">
              <span className="text-sm font-medium">LGA</span>
              <Input value={profile.lga || ""} onChange={(e) => setProfile((p:any) => ({ ...p, lga: e.target.value }))} />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Estate / Hotel</span>
              <Input value={profile.estate || ""} onChange={(e) => setProfile((p:any) => ({ ...p, estate: e.target.value }))} />
            </label>

            {/* Logo upload */}
            <div>
              <Label>Upload Logo</Label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
            </div>

            <div className="flex gap-2 mt-3">
              <Button onClick={() => saveVendorProfile({})}>Save Profile</Button>
              <Button variant="outline" onClick={() => { /* maybe navigate to public store */ }}>View Store</Button>
            </div>
          </div>

          {/* Bank details (only visible to admin/staff, not customers) */}
          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <div className="text-sm font-semibold mb-2">Bank Details</div>

            {/* Input fields */}
            <label className="block text-xs mb-2">
              <span>Bank Name</span>
              <Input value={profile.bankName || ""} onChange={(e) => setProfile((p:any) => ({ ...p, bankName: e.target.value }))} />
            </label>

            <label className="block text-xs mb-2">
              <span>Account Number</span>
              <Input value={profile.accountNumber || ""} onChange={(e) => setProfile((p:any) => ({ ...p, accountNumber: e.target.value }))} />
            </label>

            <label className="block text-xs">
              <span>Account Name</span>
              <Input value={profile.accountName || ""} onChange={(e) => setProfile((p:any) => ({ ...p, accountName: e.target.value }))} />
            </label>

            <div className="mt-3">
              <div className="text-xs text-muted-foreground">Bank info is only shown to Admin and Staff.</div>
              {/* Display masked to customers in UI - server-side rules will also protect */}
              <div className="mt-2 text-sm">
                {showBankToViewer ? (
                  <div>
                    <div><strong>{profile.bankName}</strong></div>
                    <div>{profile.accountNumber} — {profile.accountName}</div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Hidden from customers</div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Product Form + Listing */}
        <motion.section layout className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xl font-semibold">Products</div>
              <div className="text-sm text-muted-foreground">Add new items to your catalog</div>
            </div>
            <div className="text-xs text-muted-foreground">Products visible to customers once added</div>
          </div>

          {/* Add product form */}
          <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <Label>Product Name</Label>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>

            <div>
              <Label>Price (₦)</Label>
              <Input type="number" value={productPrice as any} onChange={(e) => setProductPrice(Number(e.target.value) || "")} />
            </div>

            <div>
              <Label>Image</Label>
              <input type="file" accept="image/*" onChange={handleProductImageChange} />
              {productImagePreview && (
                <div className="mt-2">
                  <img src={productImagePreview} alt="preview" className="w-28 h-28 rounded-md object-cover border" />
                </div>
              )}
            </div>

            <div className="md:col-span-3 flex gap-2 mt-2">
              <Button type="submit">Add Product</Button>
              <Button variant="ghost" onClick={() => { setProductName(""); setProductPrice(""); setProductImagePreview(null); }}>Clear</Button>
            </div>
          </form>

          {/* Product list */}
          <div className="mt-6 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center p-6"><div className="loader">Loading...</div></div>
            ) : products.length === 0 ? (
              <div className="text-muted-foreground">No products yet — add your first product above.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((p) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-3 rounded-xl border">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      {p.imageBase64 ? <img src={p.imageBase64} className="w-full h-full object-cover" alt={p.name} /> : <div className="flex items-center justify-center h-full text-sm">No image</div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-muted-foreground">₦{Number(p.price).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={() => handleDeleteProduct(p.id)}>Delete</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
    }
