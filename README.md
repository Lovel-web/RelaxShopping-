# RelaxShopping - Scheduled Grocery Delivery Platform

RelaxShopping is a production-ready full-stack web application for scheduled-round grocery delivery targeting estates and hotels in Nigeria. It features live store prices, batch order management, Paystack payment integration, and WhatsApp admin notifications.

## 🚀 Features

- **🔐 Firebase Authentication** - Email/password signup with Nigerian phone validation
- **🛒 Live Store Pricing** - Real-time prices from Chowdeck, Shoprite, and partner stores
- **⏰ Scheduled Batch Deliveries** - 3 daily time slots (10AM, 1PM, 4PM)
- **💳 Paystack Integration** - Secure payment processing with transaction verification
- **📱 WhatsApp Notifications** - Admin alerts for batch readiness and order updates
- **📊 Admin Dashboard** - Order management, batch tracking, and delivery coordination
- **🏘️ Estate-Focused** - Group orders by estate/hotel for efficient delivery
- **📦 Order Batching** - Automatic batching based on location and time slot

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for accessible components
- **React Router** for navigation

### Backend & Services
- **Firebase** - Authentication & Firestore database
- **Netlify Functions** - Serverless API endpoints
- **Paystack** - Payment processing
- **WhatsApp Cloud API** - Admin notifications

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- Netlify account (for deployment)
- Paystack account (Nigerian business)
- WhatsApp Business account (optional but recommended)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** → Email/Password provider
4. Create a **Firestore Database** in production mode
5. Get your Firebase config from Project Settings → General → Your apps
6. Copy `.env.example` to `.env` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Firestore Security Rules

Add these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Shops collection (read-only for customers)
    match /shops/{shopId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products collection (read-only for customers)
    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Batches collection (admin only write)
    match /batches/{batchId} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 3. Paystack Setup

1. Sign up at [Paystack](https://paystack.com/) (Nigerian business required)
2. Get your **Public Key** and **Secret Key** from Settings → API Keys & Webhooks
3. Add public key to `.env`:

```env
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
```

4. The **Secret Key** will be added to Netlify later (never commit it to code)

### 4. Partner Store API Setup (Optional)

#### Option A: Chowdeck / Shoprite B2B API (Recommended)

If you have official API access:
1. Get API credentials from Chowdeck or Shoprite B2B partnership team
2. Add to Netlify environment variables (see deployment section)

#### Option B: Scraper Fallback (Temporary)

**⚠️ Important**: The scraper is a temporary fallback. Always pursue official partnership.

- Scraper respects `robots.txt`
- Rate limit: 1 request per 5 seconds per domain
- Results cached 6-12 hours in Firestore
- See `netlify/functions/scrape-shop.ts` for implementation details

### 5. WhatsApp Notifications Setup (Optional)

#### Using WhatsApp Cloud API (Meta):

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app → Add WhatsApp product
3. Get your **Phone Number ID** and **Access Token**
4. Create message templates (must be approved by Meta)
5. Add to Netlify environment variables:

```
WA_PROVIDER=meta
WA_TOKEN=your_whatsapp_token
WA_PHONE_ID=your_phone_number_id
ADMIN_WHATSAPP_NUMBERS=+234XXXXXXXXXX
```

#### Using Twilio (Alternative):

```
WA_PROVIDER=twilio
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
ADMIN_WHATSAPP_NUMBERS=+234XXXXXXXXXX
```

### 6. Local Development

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Run local development server with Netlify functions
netlify dev
```

The app will be available at `http://localhost:8888`

## 🚢 Deployment to Netlify

### 1. Connect Your Repository

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Build settings should auto-detect from `netlify.toml`

### 2. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

**Required:**
```
PAYSTACK_SECRET_KEY = your_paystack_secret_key_here
```

**Optional (if using official APIs):**
```
CHOWDECK_API_KEY=your_key
SHOPRITE_API_KEY=your_key
```

**Optional (for WhatsApp notifications):**
```
WA_PROVIDER=meta
WA_TOKEN=your_token
WA_PHONE_ID=your_phone_id
ADMIN_WHATSAPP_NUMBERS=+234XXXXXXXXXX,+234YYYYYYYYYY
```

**Optional (custom delivery fee):**
```
DELIVERY_FEE_NGN=400
```

### 3. Configure Paystack Webhook

1. In Netlify, note your site URL (e.g., `https://your-site.netlify.app`)
2. Go to Paystack Dashboard → Settings → API Keys & Webhooks
3. Add webhook URL: `https://your-site.netlify.app/.netlify/functions/paystack-webhook`
4. Save your webhook secret and add to Netlify environment variables:

```
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Deploy

```bash
# Deploy via Git push
git push origin main

# Or deploy manually
netlify deploy --prod
```

## 📱 Usage

### For Customers:

1. **Sign Up** - Create account with estate/hotel details and Nigerian phone number
2. **Browse Shops** - View partner stores with live pricing
3. **Add to Cart** - Select products and quantities
4. **Choose Time Slot** - Pick from 5 daily delivery windows
5. **Pay with Paystack** - Secure checkout (₦400 fixed delivery fee)
6. **Track Order** - Monitor order status and batch assignment

### For Admins:

1. **View Orders** - See all orders grouped by batch
2. **Manage Batches** - Mark as packed, assign to driver/van
3. **Update Status** - Track delivery progress
4. **WhatsApp Alerts** - Automatic notifications when batches are ready

## 💰 Delivery Fee

A standard **₦400 delivery fee** is applied to every order. This fee is:
- Stored in Firestore per order (`deliveryFee` field)
- Added to Paystack transaction totals
- Configurable via `DELIVERY_FEE_NGN` environment variable

To change the fee:
1. Go to Netlify → Environment Variables
2. Update `DELIVERY_FEE_NGN` to your desired amount
3. Redeploy the site

## 🔒 Security Best Practices

- ✅ All secrets in environment variables (never in code)
- ✅ Paystack secret key server-side only (Netlify Functions)
- ✅ Firestore Security Rules properly configured
- ✅ WhatsApp tokens server-side only
- ✅ Input validation on all forms
- ✅ Rate limiting on scraper functions
- ✅ Webhook signature verification

## 🧪 Testing

### Test Paystack Payments:

Use test cards from [Paystack Test Cards](https://paystack.com/docs/payments/test-payments):
- Success: 4084084084084081
- Declined: 4084080000000408

### Test Endpoints Locally:

```bash
# Test Paystack init
curl -X POST http://localhost:8888/.netlify/functions/paystack-init \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","amount":5000,"orderId":"TEST-123"}'

# Test Paystack verify
curl http://localhost:8888/.netlify/functions/paystack-verify?reference=TEST-123

# Test WhatsApp send (if configured)
curl -X POST http://localhost:8888/.netlify/functions/send-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"to":"+234XXXXXXXXXX","message":"Test message"}'
```

## 📊 Firestore Data Structure

```
users/{uid}
  - email, fullName, phone, state, lga, estateOrHotel, role
  - createdAt, updatedAt

shops/{shopId}
  - name, description, image, category, isActive
  - apiType, apiEndpoint, lastSyncedAt

products/{productId}
  - shopId, name, description, price, unit, image
  - category, inStock, lastUpdated

orders/{orderId}
  - userId, userEmail, userPhone, userName
  - items[], subtotal, deliveryFee, serviceFee, vat, total
  - estateOrHotel, state, lga
  - batchSlot, batchDate, batchId
  - paymentRef, paymentStatus, status
  - createdAt, updatedAt

batches/{batchId}
  - date, slot, estateOrHotel, shopId, shopName
  - orderIds[], orderCount, totalValue
  - status, threshold, driverName, vanNumber
  - adminNotified, createdAt, updatedAt
```

## 🤝 Contributing

This is a production project. For changes:
1. Create feature branch
2. Test locally with `netlify dev`
3. Create pull request with detailed description
4. Ensure all tests pass

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
- Check Firebase Console for auth/database errors
- Check Netlify Functions logs for API errors
- Verify all environment variables are set correctly
- Check Paystack dashboard for payment issues

---

**Built with ❤️ for Nigerian estates and hotels**
