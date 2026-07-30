# ⌚ Premium Watch Brand Showcase

A full-stack, luxury e-commerce and showcase platform built with Next.js 15. This project delivers a high-end user experience featuring interactive 3D watch models, fluid animations, dynamic product filtering, and a functional Contact Us email integration.

---

## ✨ Features

* **3D Product Showcases:** Interactive, fully rotatable 3D watch models powered by Three.js & React Three Fiber.
* **Curated Collections:** Dynamic product filtering and browsing by collection.
* **Interactive Brand Timeline:** A visual interactive history of the brand's heritage and milestones.
* **Fluid Animations:** Smooth page transitions and micro-interactions with Framer Motion.
* **Functional Contact Form:** Contact form with backend email sending capability powered by Nodemailer.
* **Database & Caching:** PostgreSQL database with Prisma ORM and Upstash Redis caching layer.

---

## 🛠 Tech Stack

**Frontend & Styling**
* Next.js (App Router)
* React 19
* Tailwind CSS
* Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
* Framer Motion
* Lucide React Icons

**Backend & Database**
* Node.js
* Prisma ORM (PostgreSQL)
* Nodemailer (Email integration)
* Upstash Redis (Caching)

---

## 📋 Prerequisites

Before setting up the project locally, ensure you have the following installed:

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **PostgreSQL**: A local instance or cloud database (e.g., [Neon](https://neon.tech), Supabase, or AWS RDS)

---

## 🚀 Local Setup & Installation

Follow these step-by-step instructions to get the project running locally:

### 1. Clone the repository
```bash
git clone https://github.com/psoumojit40/watch-brand-website.git
cd watch-brand-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Copy the `.env.example` file to create your local `.env` configuration:

```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

Open `.env` in your code editor and update the values:
```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@localhost:5432/watch_brand?sslmode=require"

# Upstash Redis Caching (Optional)
UPSTASH_REDIS_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_TOKEN="your-upstash-redis-token"

# Email / SMTP Settings (Nodemailer for Contact Us Form)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
CONTACT_EMAIL_TO="your-email@gmail.com"
```

> 💡 **Note for Gmail Users**: Use an **App Password** for `SMTP_PASS` instead of your account password (generated via Google Account -> Security -> 2-Step Verification -> App Passwords).

### 4. Setup Database Schema & Seed Data
Push the Prisma schema to your PostgreSQL database and populate initial sample data:

```bash
# Generate Prisma Client & push schema to database
npx prisma db push
npx prisma generate

# Seed sample products, collections, and timeline events
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🌐 Live Demo

✨ Experience the live deployment: [https://watchwebsite-jade.vercel.app/](https://watchwebsite-jade.vercel.app/)
