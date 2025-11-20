# Healthkathon API Testing Guide

Test semua endpoint API menggunakan Postman atau cURL.

## Setup Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import file ini atau manually create requests

## 🔐 Authentication

Semua endpoint (kecuali auth) memerlukan token:

```
Header: Authorization
Value: Bearer <token_dari_login>
```

---

## 📍 Endpoints

### 1. REGISTER

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`  
**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "62812345678"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "cuid123...",
      "email": "test@example.com",
      "name": "Test User",
      "phone": "62812345678"
    },
    "token": "eyJhbGc..."
  }
}
```

---

### 2. LOGIN

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`  
**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "cuid123...",
      "email": "test@example.com",
      "name": "Test User"
    },
    "token": "eyJhbGc..."
  }
}
```

**Save token untuk request berikutnya!**

---

### 3. CEK KESEHATAN (Create)

**Method:** `POST`  
**URL:** `http://localhost:3000/api/health`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer <TOKEN_DARI_LOGIN>
```

**Body:**

```json
{
  "height": 170,
  "weight": 65,
  "bloodPressure": "120/80",
  "bloodSugar": 100,
  "cholesterol": 180,
  "notes": "Kesehatan saya baik"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Data kesehatan berhasil disimpan",
  "data": {
    "id": "cuid456...",
    "height": 170,
    "weight": 65,
    "bmi": 22.49,
    "status": "normal",
    "bloodPressure": "120/80",
    "bloodSugar": 100,
    "createdAt": "2025-11-20T..."
  }
}
```

---

### 4. AMBIL RIWAYAT KESEHATAN

**Method:** `GET`  
**URL:** `http://localhost:3000/api/health`  
**Headers:**

```
Authorization: Bearer <TOKEN_DARI_LOGIN>
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Data kesehatan berhasil diambil",
  "data": {
    "latest": {
      "id": "cuid456...",
      "height": 170,
      "weight": 65,
      "bmi": 22.49,
      "status": "normal"
    },
    "history": [
      {
        "id": "cuid456...",
        "createdAt": "2025-11-20T..."
      }
    ]
  }
}
```

---

### 5. CHAT DENGAN AI

**Method:** `POST`  
**URL:** `http://localhost:3000/api/chatbot`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer <TOKEN_DARI_LOGIN>
```

**Body:**

```json
{
  "message": "Apa saja gejala diabetes?",
  "source": "gemini"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Pesan berhasil diproses",
  "data": {
    "id": "cuid789...",
    "message": "Apa saja gejala diabetes?",
    "response": "Gejala diabetes meliputi... [AI response]",
    "source": "gemini",
    "createdAt": "2025-11-20T..."
  }
}
```

---

### 6. AMBIL RIWAYAT CHAT

**Method:** `GET`  
**URL:** `http://localhost:3000/api/chatbot`  
**Headers:**

```
Authorization: Bearer <TOKEN_DARI_LOGIN>
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Riwayat chat diambil",
  "data": []
}
```

---

### 7. KIRIM NOTIFIKASI WHATSAPP

**Method:** `POST`  
**URL:** `http://localhost:3000/api/notify-wa`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer <TOKEN_DARI_LOGIN>
```

**Body:**

```json
{
  "phoneNumber": "62812345678",
  "message": "Halo! Ini notifikasi kesehatan dari Healthkathon."
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Pesan WA berhasil dikirim",
  "data": {
    "messageId": "msg123..."
  }
}
```

---

## 🧪 Testing Workflow

### Test Complete User Journey

#### Step 1: Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass123",
    "phone": "62812345678"
  }'
```

#### Step 2: Save Token

Salin `token` dari response Step 1

#### Step 3: Cek Kesehatan

```bash
curl -X POST http://localhost:3000/api/health \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "height": 170,
    "weight": 65
  }'
```

#### Step 4: Chat dengan AI

```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "Apa itu kolesterol?",
    "source": "gemini"
  }'
```

---

## ❌ Error Handling

### Invalid Token

**Response:**

```json
{
  "success": false,
  "message": "Token tidak valid",
  "error": "..."
}
```

**Solution:** Login ulang dan gunakan token baru

### Missing Required Fields

**Response:**

```json
{
  "success": false,
  "message": "Email dan password harus diisi"
}
```

**Solution:** Pastikan semua required fields diisi

### Database Error

**Response:**

```json
{
  "success": false,
  "message": "Terjadi kesalahan saat menyimpan data",
  "error": "..."
}
```

**Solution:** Check PostgreSQL connection

### Gemini API Error

**Response:**

```json
{
  "success": false,
  "message": "Terjadi kesalahan saat memproses pesan",
  "error": "..."
}
```

**Solution:** Check GEMINI_API_KEY di `.env.local`

---

## 📊 Database Check (Prisma Studio)

```bash
# Jalankan Prisma Studio
npx prisma studio

# Buka di browser: http://localhost:5555
# Bisa lihat & edit data langsung
```

---

## 💾 Save Requests to Postman Collection

Klik "Save" di Postman untuk create collection, kemudian export sebagai `.json` untuk sharing dengan team.

---

Happy Testing! 🚀
