export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  state: string;
  lga: string;
  estateOrHotel: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  isActive: boolean;
  apiType?: 'chowdeck' | 'shoprite' | 'scraper';
  apiEndpoint?: string;
  lastSyncedAt?: Date;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  image?: string;
  category?: string;
  inStock: boolean;
  lastUpdated: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface BatchSlot {
  time: string;
  label: string;
  cutoffHour: number; // Hour of day when this slot is no longer available
}

export const BATCH_SLOTS: BatchSlot[] = [
  { time: '08:00', label: '8:00 AM', cutoffHour: 6 },
  { time: '10:00', label: '10:00 AM', cutoffHour: 8 },
  { time: '12:00', label: '12:00 PM', cutoffHour: 10 },
  { time: '15:00', label: '3:00 PM', cutoffHour: 13 },
  { time: '17:00', label: '5:00 PM', cutoffHour: 15 }
];

export const DELIVERY_FEE = 400; // ₦400 fixed delivery fee

export interface OrderItem {
  productId: string;
  productName: string;
  shopId: string;
  shopName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userPhone: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  vat: number;
  total: number;
  estateOrHotel: string;
  state: string;
  lga: string;
  batchSlot: string;
  batchDate: string;
  batchId?: string;
  paymentRef: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'paid' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Batch {
  id: string;
  date: string; // YYYY-MM-DD
  slot: string; // HH:MM
  estateOrHotel: string;
  shopId: string;
  shopName: string;
  orderIds: string[];
  orderCount: number;
  totalValue: number;
  status: 'pending' | 'ready' | 'assigned' | 'out_for_delivery' | 'completed';
  threshold: number; // Number of orders to mark as ready
  driverName?: string;
  vanNumber?: string;
  adminNotified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaystackTransaction {
  reference: string;
  amount: number;
  email: string;
  status: 'pending' | 'success' | 'failed';
  orderId: string;
  createdAt: Date;
}
