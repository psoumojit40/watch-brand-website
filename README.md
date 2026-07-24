# ⌚ Premium Watch Brand Experience

A full-stack, immersive e-commerce and showcase platform built with Next.js. This project delivers a high-end user experience featuring interactive 3D models, smooth animations, and a highly responsive design.

---

## ✨ Features

*   **3D Product Showcases:** Interactive, fully rotatable 3D watch models.
*   **Curated Collections:** Dynamic product filtering and browsing.
*   **Interactive Timeline:** A visual history of the brand's legacy.
*   **Fluid Animations:** Seamless page transitions and micro-interactions.

---

## 🛠 Tech Stack

**Frontend & Styling**
*   Next.js (App Router)
*   React
*   Tailwind CSS
*   Three.js / React Three Fiber (3D rendering)
*   Framer Motion (Animations)

**Backend & Database**
*   Node.js
*   Prisma ORM
*   PostgreSQL
*   Upstash (Redis caching)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   Node.js (v18 or higher)
*   npm (v9 or higher)
*   PostgreSQL (Local instance or a cloud provider)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

**1. Clone the repository**
```bash
git clone [https://github.com/psoumojit40/watch-brand-website.git](https://github.com/psoumojit40/watch-brand-website.git)
cd watch-brand-showcase
```
**2. Install dependencies**
```bash
npm install
```

# PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@localhost:5432/watch_brand?schema=public"

# Upstash Redis (Optional for caching)
*  UPSTASH_REDIS_URL="[https://your-region.upstash.io](https://your-region.upstash.io)"
*  UPSTASH_REDIS_TOKEN="your-token"
```bash
npx prisma db push
npx prisma generate
npm run seed
npm run dev
```
# Check it out: https://watch-brand-website.vercel.app/
