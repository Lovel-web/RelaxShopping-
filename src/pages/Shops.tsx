// src/pages/Shops.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, ExternalLink } from "lucide-react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function Shops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.lga) fetchShops();
  }, [profile]);

  async function fetchShops() {
    try {
      const q = query(collection(db, "shops"), where("lga", "==", profile.lga));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setShops(data);
    } catch (err) {
      console.error("Error fetching shops:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Partner Stores</h1>

        {loading ? (
          <p>Loading stores...</p>
        ) : shops.length === 0 ? (
          <Card className="p-12 text-center">
            <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Stores Available</h3>
            <p className="text-muted-foreground">
              We're adding new stores soon. Check back later!
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Link key={shop.id} to={`/shops/${shop.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    {shop.image ? (
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold">{shop.name}</h3>
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
                  <Badge variant="secondary" className="mt-2">{shop.category || "General"}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
