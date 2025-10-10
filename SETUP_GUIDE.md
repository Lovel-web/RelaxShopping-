# Zeezy Pro - Quick Setup Guide for Non-Technical Users

This guide will help you set up and deploy Zeezy Pro step by step.

## 📋 What You'll Need

1. **GitHub Account** (free) - to store your code
2. **Firebase Account** (free tier available) - for user accounts and database
3. **Netlify Account** (free tier available) - to host your website
4. **Paystack Account** (Nigerian business required) - for payments
5. **WhatsApp Business Account** (optional) - for admin notifications

## 🚀 Step-by-Step Setup

### Step 1: Get the Code

1. This code is already in a GitHub repository
2. Make sure you have access to it
3. Download or clone it to your computer

### Step 2: Set Up Firebase

**What is Firebase?** It stores user accounts, orders, and shop information.

1. Go to https://console.firebase.google.com/
2. Click "Create a project" or "Add project"
3. Name it "Zeezy Pro" (or any name you like)
4. Disable Google Analytics (you can enable later if needed)
5. Click "Create project"

**Enable Authentication:**
1. In Firebase, click "Authentication" in the left menu
2. Click "Get started"
3. Click "Email/Password" and enable it
4. Click "Save"

**Create a Database:**
1. Click "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to Nigeria (e.g., "europe-west")
5. Click "Enable"

**Get Your Firebase Config:**
1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the "</>" icon (Web)
5. Register app name as "Zeezy Pro Web"
6. Copy all the values shown (you'll need these later)
7. **Keep these safe!** You'll paste them in Netlify

### Step 3: Set Up Firestore Security Rules

1. In Firebase Console, go to Firestore Database → Rules
2. Replace the rules with the rules from `README.md` (see Firestore Security Rules section)
3. Click "Publish"

### Step 4: Set Up Paystack

**What is Paystack?** It processes customer payments securely.

**Requirements:** You need a registered Nigerian business.

1. Go to https://paystack.com/
2. Click "Create a free account"
3. Complete business verification (may take 1-2 days)
4. Once verified, go to Settings → API Keys & Webhooks
5. Copy your **Test Public Key** (starts with `pk_test_`)
6. Copy your **Test Secret Key** (starts with `sk_test_`) - **Keep this very secret!**
7. Don't share the secret key with anyone or put it in code

### Step 5: Deploy to Netlify

**What is Netlify?** It hosts your website for free.

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your Zeezy Pro repository
4. Netlify should auto-detect the settings
5. Before clicking "Deploy", click "Advanced" to add environment variables

**Add Environment Variables in Netlify:**

Click "New variable" for each of these:

**Firebase variables** (from Step 2):
```
VITE_FIREBASE_API_KEY = (paste from Firebase)
VITE_FIREBASE_AUTH_DOMAIN = (paste from Firebase)
VITE_FIREBASE_PROJECT_ID = (paste from Firebase)
VITE_FIREBASE_STORAGE_BUCKET = (paste from Firebase)
VITE_FIREBASE_MESSAGING_SENDER_ID = (paste from Firebase)
VITE_FIREBASE_APP_ID = (paste from Firebase)
```

**Paystack variables** (from Step 4):
```
VITE_PAYSTACK_PUBLIC_KEY = pk_test_xxxxx (your test public key)
PAYSTACK_SECRET_KEY = sk_test_xxxxx (your test secret key)
```

6. Click "Deploy site"
7. Wait 2-5 minutes for deployment to complete

### Step 6: Set Up Paystack Webhook

**What is a webhook?** It lets Paystack tell your app when payments succeed.

1. Note your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Go to Paystack Dashboard → Settings → API Keys & Webhooks
3. Scroll to "Webhook URL"
4. Enter: `https://your-site-name.netlify.app/.netlify/functions/paystack-webhook`
5. Click "Save changes"
6. Copy the "Webhook Secret" shown
7. Go back to Netlify → Site settings → Environment variables
8. Add new variable: `PAYSTACK_WEBHOOK_SECRET` = (paste the secret)
9. Redeploy site: Deploys → Trigger deploy → Deploy site

### Step 7: Create Your First Admin Account

1. Visit your deployed site
2. Click "Sign Up"
3. Fill in your details (use your real phone number in Nigerian format)
4. Complete signup
5. Go to Firebase Console → Firestore Database
6. Find the "users" collection
7. Find your user document (by email)
8. Edit the document
9. Change `role` from `customer` to `admin`
10. Save
11. Sign out and sign in again
12. You should now see an "Admin" link in the navigation

### Step 8: Add Sample Shops (Manual)

Since you don't have API integrations yet, manually add shops:

1. In Firebase Firestore, click "Start collection"
2. Collection ID: `shops`
3. Document ID: Auto-ID
4. Add fields:
   - `name` (string): "Shoprite"
   - `description` (string): "Fresh groceries and household items"
   - `category` (string): "Supermarket"
   - `isActive` (boolean): true
   - `image` (string): (optional - URL to shop logo)
5. Click "Save"
6. Repeat for other shops

### Step 9: Test the App

1. Visit your site
2. Sign up with a test email
3. Browse shops (you should see the ones you added)
4. Test the full flow (currently shops will be empty until you add products)

## 🎯 Next Steps

### Add Products to Shops

For now, you'll need to manually add products in Firestore:

1. Create collection: `products`
2. For each product:
   - `shopId` (string): the shop document ID
   - `name` (string): product name
   - `price` (number): price in Naira
   - `unit` (string): "kg", "piece", "pack", etc.
   - `inStock` (boolean): true
   - `image` (string): optional image URL
   - `lastUpdated` (timestamp): current time

### Go Live with Paystack

When ready for real payments:

1. Complete Paystack business verification
2. Get your **Live** keys (pk_live_ and sk_live_)
3. Update environment variables in Netlify
4. Redeploy

### Get Official Store APIs

Contact Chowdeck or Shoprite for B2B API access. This will:
- Provide automatic product updates
- Ensure accurate pricing
- Enable live stock status

## ❓ Common Issues

**"Can't sign up"**
- Check Firebase Authentication is enabled for Email/Password

**"Shops page is empty"**
- Make sure you added shops in Firestore with `isActive: true`

**"Payment not working"**
- Verify Paystack keys are correct in Netlify
- Check Paystack webhook URL is set correctly
- Make sure you're using test cards from Paystack docs

**"Admin dashboard not showing"**
- Make sure your user role is set to "admin" in Firestore

## 🆘 Getting Help

1. Check Netlify Functions logs: Netlify → Functions → [function name] → Logs
2. Check Firebase logs: Firebase Console → Functions → Logs
3. Check browser console: Press F12 → Console tab
4. Check Paystack dashboard for payment status

## 📞 Support

- Paystack Support: support@paystack.com
- Firebase Support: https://firebase.google.com/support
- Netlify Support: https://www.netlify.com/support/

---

**🎉 Congratulations!** Your Zeezy Pro platform is now live.
