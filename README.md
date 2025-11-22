# MedpredictJKN - Aplikasi Kesehatan Digital

Aplikasi kesehatan full-stack built dengan **Next.js 14**, **PostgreSQL**, **Prisma**, dan **Gemini AI**.

## 🚀 Features

- ✅ Autentikasi (Register/Login dengan JWT)
- ✅ Cek Kesehatan & Kalkulasi BMI
- ✅ Chat dengan AI Gemini
- ✅ Notifikasi WhatsApp (Fonnte)
- ✅ Dashboard Personal
- ✅ Riwayat Kesehatan
- ✅ Responsive UI dengan Tailwind CSS

## 📁 Struktur Folder

```
healthkathon/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts      # API Register
│   │   │   └── login/route.ts         # API Login
│   │   ├── health/route.ts            # API Cek Kesehatan
│   │   ├── chatbot/route.ts           # API Chatbot (Gemini)
│   │   └── notify-wa/route.ts         # API WhatsApp Notification
│   ├── auth/
│   │   ├── register/page.tsx          # Halaman Register
│   │   └── login/page.tsx             # Halaman Login
│   ├── dashboard/page.tsx             # Dashboard
│   ├── cek-kesehatan/page.tsx         # Halaman Cek Kesehatan
│   ├── chat/page.tsx                  # Halaman Chat
│   ├── layout.tsx
│   ├── page.tsx                       # Halaman Utama
│   └── globals.css
│
├── lib/
│   ├── db.ts                          # Prisma Client Setup
│   ├── utils.ts                       # Utility Functions (JWT, Password, BMI)
│   └── services/
│       ├── health.ts                  # Health Service
│       ├── chatbot.ts                 # Chatbot Service (Gemini)
│       └── wa.ts                      # WhatsApp Service
│
├── types/
│   └── index.ts                       # TypeScript Types & Interfaces
│
├── prisma/
│   └── schema.prisma                  # Database Schema
│
├── public/
├── middleware.ts                      # Next.js Middleware (Auth Guard)
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.local                         # Environment Variables
```

## 🛠️ Setup Awal

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Copy .env.example ke .env.local
cp .env.example .env.local

# Edit .env.local dan isi DATABASE_URL dengan PostgreSQL Anda
```

### 3. Jalankan Migrasi Prisma

```bash
npx prisma migrate dev --name init
```

### 4. (Opsional) Buka Prisma Studio

```bash
npx prisma studio
```

## 📋 Environment Variables

Buat file `.env.local` berdasarkan `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/healthkathon"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Gemini API (untuk Chatbot)
FAST_API_KEY="your-gemini-api-key"

# FastAPI (Opsional)
FASTAPI_URL="http://localhost:8000"

# WhatsApp API (Opsional - Fonnte)
FONNTE_API_KEY="your-fonnte-api-key"
FONNTE_DEVICE_ID="your-device-id"

# Next.js
NODE_ENV="development"
```

## 🚀 Jalankan Project

```bash
# Development
npm run dev

# Buka http://localhost:3000
```

## 📖 API Endpoints

### Auth

| Method | Endpoint             | Deskripsi          |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register user baru |
| POST   | `/api/auth/login`    | Login user         |

### Health

| Method | Endpoint      | Deskripsi                   |
| ------ | ------------- | --------------------------- |
| POST   | `/api/health` | Simpan data kesehatan (BMI) |
| GET    | `/api/health` | Ambil riwayat kesehatan     |

### Chatbot

| Method | Endpoint       | Deskripsi          |
| ------ | -------------- | ------------------ |
| POST   | `/api/chatbot` | Kirim pesan ke AI  |
| GET    | `/api/chatbot` | Ambil riwayat chat |

### WhatsApp

| Method | Endpoint         | Deskripsi                 |
| ------ | ---------------- | ------------------------- |
| POST   | `/api/notify-wa` | Kirim notifikasi WhatsApp |

## 🔒 Authentication

Semua endpoint (kecuali `/api/auth/*`) memerlukan JWT token di header:

```
Authorization: Bearer <token>
```

## 📊 Database Models

### User

```prisma
- id: String (CUID)
- email: String (unique)
- password: String (hashed)
- name: String
- phone?: String
- age?: Int
- gender?: String
```

### HealthData

```prisma
- id: String
- userId: String
- height: Float
- weight: Float
- bmi: Float
- status: String (underweight, normal, overweight, obese)
- bloodPressure?: String
- bloodSugar?: Float
- cholesterol?: Float
- notes?: String
```

### ChatHistory

```prisma
- id: String
- userId: String
- message: String
- response: String
- source: String (gemini, fastapi)
- createdAt: DateTime
```

## 🎯 Cara Kerja Fitur

### 1. Register & Login

- User membuat akun dengan email & password
- Password di-hash menggunakan bcryptjs
- Setelah login, menerima JWT token
- Token disimpan di localStorage (client-side)

### 2. Cek Kesehatan

- User input tinggi & berat badan
- Sistem otomatis hitung BMI
- Data disimpan ke database
- Jika ada nomor telepon, kirim notifikasi WhatsApp

### 3. Chat dengan AI

- User input pertanyaan kesehatan
- Dikirim ke Gemini API
- Response disimpan ke database
- Ditampilkan real-time di UI

### 4. Notifikasi WhatsApp

- Triggered setelah user cek kesehatan
- Mengirim hasil BMI & rekomendasi
- Menggunakan Fonnte API (opsional)

## 🔧 Integrasi Eksternal

### Gemini API

```typescript
// .env.local
FAST_API_KEY = "AIzaSy...";

// Dapatkan di: https://ai.google.dev/
```

### FastAPI (Optional)

```python
# Jalankan FastAPI di port 8000
python -m uvicorn main:app --reload

# Endpoint: POST /chat
# Body: {"message": "Apa itu diabetes?"}
```

### Fonnte WhatsApp (Optional)

```
# Dapatkan di: https://www.fonnte.com/
# Format nomor: 62812xxxxxxxx (tanpa 0 di depan)
```

## 📝 Request/Response Examples

### Register

**Request:**

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "62812xxxxxxxx"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "cuid123",
      "email": "john@example.com",
      "name": "John Doe",
      "phone": "62812xxxxxxxx"
    },
    "token": "eyJhbGc..."
  }
}
```

### Cek Kesehatan

**Request:**

```json
POST /api/health
Authorization: Bearer <token>
{
  "height": 170,
  "weight": 65,
  "bloodPressure": "120/80",
  "bloodSugar": 100
}
```

**Response:**

```json
{
  "success": true,
  "message": "Data kesehatan berhasil disimpan",
  "data": {
    "id": "cuid456",
    "height": 170,
    "weight": 65,
    "bmi": 22.49,
    "status": "normal",
    "createdAt": "2025-11-20T..."
  }
}
```

### Chat

**Request:**

```json
POST /api/chatbot
Authorization: Bearer <token>
{
  "message": "Apa itu kolesterol tinggi?",
  "source": "gemini"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Pesan berhasil diproses",
  "data": {
    "id": "cuid789",
    "message": "Apa itu kolesterol tinggi?",
    "response": "Kolesterol tinggi adalah...",
    "source": "gemini",
    "createdAt": "2025-11-20T..."
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Setup environment variables di Vercel Dashboard
```

### Railway / Render

1. Push code ke GitHub
2. Connect repository ke Railway/Render
3. Set environment variables
4. Auto-deploy on push

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Pastikan PostgreSQL running
# Cek DATABASE_URL di .env.local
# Jalankan: npx prisma db push
```

### JWT Token Error

```bash
# Generate JWT_SECRET baru
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Gemini API Error

```bash
# Pastikan FAST_API_KEY valid
# Check API quota di https://ai.google.dev/
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Gemini API](https://ai.google.dev)
- [JWT](https://jwt.io)
- [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## 📄 License

MIT

## 👨‍💻 Author

Healthkathon Team - 2025

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
