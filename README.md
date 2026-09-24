<div align="center">

# 🛒 CartFusion

### A Full-Stack E-Commerce Platform Built for Buyers, Merchants & Admins

CartFusion is a complete online shopping platform built from scratch with Next.js — where customers shop, merchants manage their products and orders, and admins keep the whole store running smoothly.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe)](https://stripe.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://cart-fusion.vercel.app)

**[🚀 Live Demo](https://cart-fusion.vercel.app)**

</div>

---

## 💡 The Idea

CartFusion isn't just a shopping cart demo — it's a complete e-commerce system with three roles working together:

| 🛍️ Buyer | 🏪 Merchant | 🛡️ Admin |
|---|---|---|
| Browses & buys products | Lists and manages their products | Approves merchants & products |
| Tracks, cancels, returns orders | Fulfills orders with OTP-verified delivery | Oversees the entire platform |
| Chats with AI-assisted support | Watches sales unfold on live charts | Keeps quality and trust in check |

---

## ✨ What's Inside

**🛍️ For Shoppers**
- Product discovery with category & shop filters
- Cart → Checkout → **COD or Stripe** — buyer's choice
- Live order tracking through every status: *pending → confirmed → shipped → delivered*
- Return window that counts down in real time
- Reviews with star ratings and photos
- A support inbox that doesn't leave you hanging — **AI drafts the reply for you**

**🏪 For Merchants**
- Full product CRUD, gated behind an admin approval workflow
- Delivery confirmation secured with **OTP verification**
- A dashboard that actually visualizes the business — order trends, status breakdowns, top-selling products
- Direct line to customers via real-time chat

**🛡️ For Admins**
- One-click approve/reject for merchants and products
- A bird's-eye view of the entire platform's health
- The final word in every support conversation

---

## 🧰 Built With

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- Redux Toolkit
- Recharts

</td>
<td valign="top" width="33%">

**Backend**
- Next.js API Routes
- MongoDB + Mongoose
- NextAuth.js (Auth.js)
- Nodemailer

</td>
<td valign="top" width="33%">

**Third-Party**
- Cloudinary (media)
- Stripe (payments)
- Google Gemini (AI replies)
- Vercel (hosting)

</td>
</tr>
</table>

---

## 🚀 Quick Start

```bash
# Clone it
git clone https://github.com/shiuly-28/CartFusion.git
cd CartFusion/cartfusion-client

# Install it
npm install

# Configure it — create .env.local
MONGODB_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_USER=
GMAIL_APP_PASSWORD=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOKS_KEY=
GEMINI_API_KEY=
NEXT_BASE_URL=http://localhost:3000

# Run it
npm run dev
```

Visit **http://localhost:3000** and start shopping, selling, or supervising.

---

## ☁️ Deploying Your Own

Deployed on **Vercel**. Two settings people usually miss:

> ⚠️ **Root Directory** → `cartfusion-client`
> ⚠️ **Framework Preset** → `Next.js` *(not "Other")*

Also whitelist `0.0.0.0/0` in MongoDB Atlas → Network Access, since Vercel's functions ship from rotating IPs.

---

## 🗂️ Structure at a Glance

```
cartfusion-client/
├── src/
│   ├── app/
│   │   ├── api/         ← every backend route lives here
│   │   └── (pages)/     ← shop, cart, orders, dashboards...
│   ├── component/       ← shared UI building blocks
│   ├── hooks/            ← data-fetching hooks
│   ├── model/             ← Mongoose schemas
│   ├── redux/            ← global state
│   └── lib/                ← db, cloudinary, helpers
└── public/
```

---

<div align="center">

**Crafted by [shiuly-28](https://github.com/shiuly-28)**

*If CartFusion sparked an idea, a ⭐ goes a long way.*

</div>
