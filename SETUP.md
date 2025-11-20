# 🚀 Quick Start Guide - MedpredictJKN

Panduan cepat untuk menjalankan project MedpredictJKN.

## 1️⃣ Prerequisites

- Node.js v18+ (download dari https://nodejs.org)
- PostgreSQL 14+ (download dari https://www.postgresql.org)
- Git
- Text Editor (VS Code recommended)

## 2️⃣ Setup Database PostgreSQL

### Windows / macOS / Linux

```bash
# 1. Install PostgreSQL (ikuti installer)

# 2. Buka pgAdmin atau command line
createdb healthkathon

# 3. Buat user (optional)
createuser dev
# password: dev
```

Atau gunakan GUI PostgreSQL management tool.

## 3️⃣ Clone & Setup Project

```bash
# Clone project (jika dari GitHub)
git clone https://github.com/username/healthkathon.git
cd healthkathon

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

## 4️⃣ Setup Environment Variables

```bash
# Copy file
cp .env.example .env.local

# Edit .env.local dengan editor favorit Anda
# Isi dengan config berikut:
```

**`.env.local` content:**

```env
# PostgreSQL Database
DATABASE_URL="postgresql://dev:dev@localhost:5432/healthkathon"

# JWT Secret (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET="your-generated-secret-key-here"

# Gemini AI API (dapat dari https://ai.google.dev/)
GEMINI_API_KEY="your-gemini-api-key"

# Development Environment
NODE_ENV="development"

# Optional: FastAPI URL
FASTAPI_URL="http://localhost:8000"

# Optional: WhatsApp API (Fonnte)
FONNTE_API_KEY="your-fonnte-key"
FONNTE_DEVICE_ID="your-device-id"
```

## 5️⃣ Setup Database dengan Prisma

```bash
# Jalankan migration
npx prisma migrate dev --name init

# (Optional) Lihat data dengan Prisma Studio
npx prisma studio
```

Proses ini akan:

- ✅ Create tables (User, HealthData, ChatHistory)
- ✅ Setup relationships
- ✅ Generate Prisma Client

## 6️⃣ Jalankan Development Server

```bash
npm run dev
```

Output:

```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
```

## 7️⃣ Akses Aplikasi

Buka browser dan kunjungi: **http://localhost:3000**

Anda akan melihat:

- ✅ Halaman utama dengan fitur
- ✅ Button "Daftar" dan "Masuk"
- ✅ Navigation ke semua halaman

## 📝 First Steps

### 1. Register User Baru

- Klik tombol "Daftar"
- Isi form dengan data:
  - Nama: `Test User`
  - Email: `test@example.com`
  - Password: `password123`
  - No Telepon: `62812345678`
- Klik "Daftar"
- Anda akan redirect ke Dashboard

### 2. Cek Kesehatan

- Dari Dashboard, klik "Cek Kesehatan"
- Isi data:
  - Tinggi Badan: `170` cm
  - Berat Badan: `65` kg
  - Tekanan Darah: `120/80` (optional)
  - Gula Darah: `100` (optional)
- Klik "Hitung BMI & Simpan"
- Hasil akan ditampilkan dengan rekomendasi

### 3. Chat dengan AI

- Dari Dashboard, klik "Chat dengan AI"
- Ketik pertanyaan: `Apa saja gejala diabetes?`
- Tekan "Kirim"
- AI akan menjawab pertanyaan Anda

### 4. Logout

- Dari Dashboard, klik tombol "Keluar"
- Anda akan redirect ke halaman Login

## 🐛 Common Issues & Solutions

### ❌ Error: "ECONNREFUSED" saat migrasi

**Solusi:** PostgreSQL belum running

```bash
# Windows: cari PostgreSQL service di Services
# macOS: brew services start postgresql@14
# Linux: sudo service postgresql start
```

### ❌ Error: "PROTOCOL_CONNECTION_LOST"

**Solusi:** DATABASE_URL salah di `.env.local`

```bash
# Format benar: postgresql://user:password@localhost:5432/dbname
# Cek username & password PostgreSQL Anda
```

### ❌ Error: "API Key invalid" (Gemini)

**Solusi:** GEMINI_API_KEY belum diatur

- Daftar di https://ai.google.dev/
- Buat API key baru
- Copy ke `.env.local`
- Restart development server

### ❌ Port 3000 sudah terpakai

```bash
# Kill process yang menggunakan port 3000
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000

# Atau jalankan di port lain:
npm run dev -- -p 3001
```

### ❌ Module not found "@prisma/client"

```bash
# Generate Prisma Client lagi
npx prisma generate
```

## ✅ Verify Setup

Pastikan semua ini berhasil:

```bash
# 1. Check Node version
node --version  # v18.0.0 atau lebih tinggi

# 2. Check PostgreSQL
psql --version

# 3. Check npm packages
npm list @prisma/client

# 4. Check .env.local
cat .env.local

# 5. Run build test
npm run build

# 6. Start dev server
npm run dev
```

## 📁 File Structure Reference

```
app/
├── api/              # Backend routes
├── auth/             # Auth pages
├── dashboard/        # Main dashboard
├── cek-kesehatan/    # Health check page
├── chat/             # Chatbot page
└── page.tsx          # Home page

lib/
├── db.ts             # Prisma client
├── utils.ts          # Helper functions
└── services/         # Business logic

types/
└── index.ts          # TypeScript types

prisma/
└── schema.prisma     # Database schema
```

## 🚀 Next Steps

Setelah setup berhasil:

1. **Customize UI**: Edit CSS di `app/globals.css`
2. **Add Database Fields**: Update `prisma/schema.prisma` + `npx prisma migrate dev`
3. **Deploy**: Push ke GitHub → Deploy ke Vercel
4. **Add FastAPI**: Setup chatbot dengan FastAPI jika ingin

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build

# Prisma
npx prisma studio       # Buka GUI database editor
npx prisma migrate dev  # Create new migration
npx prisma db push      # Push schema ke database
npx prisma db seed      # Seed database

# Linting
npm run lint             # Run ESLint
npm run lint -- --fix    # Fix linting issues
```

## 🆘 Need Help?

- 📖 Dokumentasi: Baca `README.md`
- 🔗 Prisma: https://www.prisma.io/docs
- ⚡ Next.js: https://nextjs.org/docs
- 🤖 Gemini: https://ai.google.dev

---

**Happy Coding!** 🎉
