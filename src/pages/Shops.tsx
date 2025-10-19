import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, ExternalLink } from 'lucide-react';
import { Shop } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { query, collection, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

export default function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const { user } = useAuth(); // get logged in user

const fetchShops = async () => {
  try {
    if (!user?.lga) return; // wait until user is loaded

    // Fetch shops only in the same LGA as the user
    const shopsQuery = query(
      collection(db, 'shops'),
      where('lga', '==', user.lga)
    );

    const snapshot = await getDocs(shopsQuery);
    const shopsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastSyncedAt: doc.data().lastSyncedAt?.toDate()
    })) as Shop[];

    setShops(shopsData.filter(shop => shop.isActive));
  } catch (error) {
    console.error('Error fetching shops:', error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Partner Stores</h1>
          <p className="text-muted-foreground">
            Browse products from our trusted grocery partners with live pricing
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-40 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </Card>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <Card className="p-12 text-center">
            <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Stores Available</h3>
            <p className="text-muted-foreground">
              We're working on adding partner stores. Check back soon!
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map(shop => (
              <Link key={shop.id} to={`/shops/${shop.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all group cursor-pointer h-full">
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    {shop.image ? (
                      <img 
                        src={shop.image} 
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {shop.name}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {shop.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {shop.category}
                    </Badge>
                    {shop.apiType && (
                      <Badge variant="outline" className="text-xs">
                        Live Pricing
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
