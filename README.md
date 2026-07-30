# ⌚ Premium Luxury Watch Brand Showcase & E-Commerce Platform

A full-stack, luxury e-commerce platform and brand showcase built with Next.js 16, React 19, and 3D web technologies. This application delivers a state-of-the-art user experience featuring interactive rotatable 3D watch models, fluid Framer Motion animations, a dynamic shopping cart, user authentication (OAuth & Credentials with OTP), order processing, and boutique appointment scheduling.

---

## ✨ Key Features

* 💎 **Interactive 3D Product Canvas:** Real-time 3D watch viewing powered by Three.js & React Three Fiber with customizable materials and camera angles.
* 🔐 **Authentication & Security:** 
  * Full user authentication powered by NextAuth v5 (Auth.js).
  * Social Sign-in via Google and Facebook OAuth.
  * Credentials login with `bcryptjs` password hashing.
  * Password Reset & Email OTP verification powered by Nodemailer.
* 🛒 **Cart & Order Management:**
  * Persistent database-synced shopping cart powered by Zustand state management and Prisma.
  * Seamless order checkout process with real-time order history tracking.
* 📅 **Boutique Appointment Booking:** Schedule private in-person viewing appointments at luxury brand boutiques with custom date/time slot selection.
* 🏛️ **Brand Heritage & Timeline:** An interactive visual journey through the brand's horological history and milestones.
* 📦 **Curated Collections & Filtering:** Filter, search, and explore watches by collection, movement type, materials, and limited-edition status.
* ⚡ **Caching & Performance:** High-speed API caching layer using Upstash Redis.
* ✉️ **Functional Contact System:** Direct contact form with serverless email notification capabilities.

---

## 🛠 Tech Stack

**Frontend & Styling**
* **Framework:** Next.js 16 (App Router)
* **Library:** React 19
* **Styling:** Tailwind CSS v4
* **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **Animations:** Framer Motion
* **State Management:** Zustand
* **Icons:** Lucide React

**Backend, Database & Security**
* **Database & ORM:** PostgreSQL with Prisma ORM
* **Authentication:** NextAuth v5 (Beta) + `@auth/prisma-adapter`
* **Caching:** Upstash Redis (`@upstash/redis`)
* **Email System:** Nodemailer (SMTP / Gmail App Passwords)
* **Security:** `bcryptjs` for secure password hashing

---

## 📋 Prerequisites

Before setting up the project locally, ensure you have the following installed:

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **PostgreSQL**: A local PostgreSQL server or cloud database (e.g., [Neon](https://neon.tech), Supabase, or AWS RDS)

---

## 🚀 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/psoumojit40/watch-brand-website.git
cd watch-brand-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Copy `.env.example` to create your local `.env` configuration:

```bash
# On Linux / macOS / Git Bash:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

Open `.env` in your code editor and configure the environment variables:
```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@localhost:5432/watch_brand?sslmode=require"

# NextAuth / Session Security Settings
NEXTAUTH_SECRET="your-nextauth-secret-key-generate-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Keys (From Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Upstash Redis Caching (Optional)
UPSTASH_REDIS_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_TOKEN="your-upstash-redis-token"

# Email / SMTP Settings (Nodemailer for Contact Form & OTPs)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
CONTACT_EMAIL_TO="your-email@gmail.com"
```

> 💡 **Note for Gmail Users**: Use an **App Password** for `SMTP_PASS` instead of your regular password (generated via Google Account -> Security -> 2-Step Verification -> App Passwords).

### 4. Setup Database Schema & Seed Data
Generate the Prisma Client, push the database schema, and populate sample data:

```bash
# Push schema and generate Prisma Client
npx prisma db push
npx prisma generate

# Seed sample products, collections, and timeline events
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.

---

## 🌐 Live Demo

✨ Experience the live deployment: [https://watchwebsite-jade.vercel.app/](https://watchwebsite-jade.vercel.app/)
