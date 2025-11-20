# MedpredictJKN - Disease Risk Prediction System

## Panduan Implementasi Sistem Prediksi Risiko Penyakit Berbasis JKN

---

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Fitur Utama](#fitur-utama)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Model Prediksi Risiko](#model-prediksi-risiko)
5. [API Endpoints](#api-endpoints)
6. [Panduan Penggunaan](#panduan-penggunaan)
7. [Roadmap Implementasi](#roadmap-implementasi)

---

## 🎯 Gambaran Umum

**MedpredictJKN** adalah sistem prediksi risiko penyakit yang memanfaatkan data Jaminan Kesehatan Nasional (JKN) untuk:

1. **Identifikasi Dini** risiko penyakit kronis sebelum gejala muncul
2. **Personalisasi** rekomendasi screening dan pencegahan per pasien
3. **Otomatisasi Alert** untuk faskes dan pasien berisiko tinggi
4. **Manajemen Proaktif** pasien dengan fokus preventif

### Target Pengguna

- **Pasien JKN**: Monitor risiko kesehatan pribadi
- **Petugas Faskes**: Identifikasi pasien berisiko tinggi untuk intervensi
- **Sistem Kesehatan**: Data epidemiologi untuk perencanaan kesehatan

---

## ✨ Fitur Utama

### 1. **Risk Calculation Engine**

Menghitung 4 penyakit prioritas dengan model berbasis faktor risiko:

- **Diabetes Mellitus Tipe 2**: Skor 0-100 berdasarkan usia, BMI, gula darah, riwayat keluarga
- **Hipertensi**: Skor berdasarkan usia, gender, BMI, tekanan darah, riwayat hipertensi
- **Jantung Koroner**: Skor berdasarkan lipid profile, age, smoking, family history
- **Stroke**: Skor berdasarkan tekanan darah, diabetes, smoking, riwayat stroke

### 2. **Automated Alert System**

- Alert severity: CRITICAL (≥85%), HIGH (≥70%), MEDIUM (≥50%)
- Notifikasi ke faskes via WhatsApp (Fonnte)
- Alert tracking untuk follow-up manajemen

### 3. **Personalized Screening Recommendations**

- Rekomendasi tes screening spesifik per penyakit
- Saran lifestyle modification customized
- Priority-based recommendations

### 4. **Health Facility Management**

- Dashboard faskes untuk monitoring pasien berisiko
- Integration dengan petugas kesehatan (health workers)
- Action tracking dan resolution logging

---

## 🏗️ Arsitektur Sistem

### Stack Teknologi

```
Frontend: Next.js 14 (App Router) + React 19 + TypeScript + Tailwind CSS
Backend: Next.js API Routes + Services Layer
Database: PostgreSQL 14+ + Prisma ORM (v6)
External APIs: Gemini AI (chatbot), Fonnte (WhatsApp)
Authentication: JWT + bcryptjs
```

### Struktur Folder

```
lib/services/
  ├── riskCalculation.ts      # Risk scoring algorithms (4 diseases)
  ├── alert.ts                # Alert creation & notification logic
  ├── screening.ts            # Screening recommendation engine
  ├── health.ts              # Existing health check service
  ├── chatbot.ts             # Existing Gemini AI service
  └── wa.ts                  # Existing WhatsApp service

app/api/
  ├── risk/route.ts          # POST /api/risk/calculate, GET /api/risk/scores
  ├── screening/             # Screening management endpoints (TODO)
  ├── facility/              # Health facility management (TODO)
  ├── alerts/                # Alert management endpoints (TODO)
  └── [existing routes]

app/
  ├── page.tsx               # Landing page
  ├── dashboard/page.tsx     # User dashboard
  ├── faskes-dashboard/      # Health worker dashboard (TODO)
  ├── risk-assessment/       # Risk assessment form (TODO)
  └── [existing pages]

prisma/schema.prisma
  ├── User (enhanced with relationships)
  ├── MedicalRecord          # JKN medical history
  ├── DiseaseRiskScore       # Calculated risk scores
  ├── ScreeningRecommendation
  ├── HealthFacility         # Faskes registration
  ├── HealthFacilityUser     # Health worker accounts
  ├── FaskesAlert            # Alert records
  ├── RiskAlertLog           # Audit trail
  └── [existing models]
```

---

## 🧮 Model Prediksi Risiko

### 1. Diabetes Mellitus Tipe 2 Score

**Faktor Risiko & Poin:**

```
Usia:
  - ≥ 45 tahun: +2 poin
  - ≥ 55 tahun: +1 poin

BMI:
  - 25-29.9: +1 poin
  - 30-34.9: +2 poin
  - ≥ 35: +3 poin

Fasting Blood Sugar:
  - 100-125 mg/dL: +3 poin
  - ≥ 126 mg/dL: +5 poin

Riwayat Hipertensi: +2 poin
Riwayat Keluarga Diabetes: +3 poin
Obat Tekanan Darah: +2 poin
Aktivitas Fisik Kurang: +2 poin

Maximum Score: 20
Konversi: (Score / 20) × 100 = Persentase Risiko
Threshold Alert: ≥ 70%
```

### 2. Hipertensi Score

**Faktor Risiko & Poin:**

```
Usia:
  - ≥ 40 tahun: +1 poin
  - ≥ 50 tahun: +1 poin
  - ≥ 60 tahun: +2 poin

Gender & Usia:
  - Pria < 55 tahun: +2 poin
  - Wanita ≥ 55 tahun: +1 poin

BMI:
  - 25-29.9: +1 poin
  - ≥ 30: +2 poin

Tekanan Darah:
  - ≥ 120/80: +1 poin
  - ≥ 130/85: +2 poin
  - ≥ 140/90: +3 poin

Riwayat Keluarga: +2 poin
Diabetes: +2 poin
Kolesterol ≥ 240: +1 poin
Perokok: +2 poin

Maximum Score: 18
Threshold Alert: ≥ 70%
```

### 3. Jantung Koroner Score

**Faktor Risiko & Poin:**

```
Usia & Gender:
  - Pria ≥ 40: +1 poin
  - Pria ≥ 50: +2 poin
  - Wanita ≥ 50: +1 poin
  - Wanita ≥ 60: +2 poin

Kolesterol Total:
  - ≥ 240: +3 poin
  - 200-239: +1 poin

Tekanan Darah ≥ 140: +2 poin
Diabetes: +3 poin
Perokok: +3 poin
Riwayat Keluarga Penyakit Jantung: +3 poin
BMI ≥ 30: +2 poin
Riwayat Penyakit Jantung Sebelumnya: +5 poin

Maximum Score: 25
Threshold Alert: ≥ 70%
```

### 4. Stroke Score

**Faktor Risiko & Poin:**

```
Usia:
  - ≥ 55 tahun: +2 poin
  - ≥ 65 tahun: +2 poin

Gender (Pria): +1 poin

Hipertensi (Faktor Terkuat): +3 poin
Tekanan Darah ≥ 140: +2 poin

Diabetes: +2 poin
Perokok: +3 poin
Atrial Fibrillation: +4 poin
LVH (Left Ventricular Hypertrophy): +2 poin

Riwayat Keluarga Stroke: +2 poin
Kolesterol ≥ 240: +1 poin

Maximum Score: 23
Threshold Alert: ≥ 70%
```

---

## 📡 API Endpoints

### Risk Calculation

**POST /api/risk/calculate**
Menghitung skor risiko penyakit berdasarkan data pasien

```bash
curl -X POST http://localhost:3000/api/risk/calculate \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 45,
    "gender": "male",
    "height": 170,
    "weight": 85,
    "bloodPressure": { "systolic": 140, "diastolic": 90 },
    "cholesterol": 250,
    "bloodSugar": 110,
    "smoker": true,
    "familyHistory": ["Diabetes", "Heart Disease"],
    "medicalHistory": ["Hypertension"],
    "diagnosis": "Annual health check",
    "medications": ["Metformin 500mg"]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "diabetes2Score": 68,
    "hypertensionScore": 75,
    "coronaryHeartScore": 72,
    "strokeScore": 65,
    "riskThreshold": 70,
    "highRiskDiseases": ["Hipertensi", "Jantung Koroner"],
    "alertSent": true,
    "calculatedAt": "2025-01-15T10:30:00Z",
    "nextCalculationDate": "2025-04-15T10:30:00Z"
  },
  "message": "Risk assessment calculated successfully"
}
```

**GET /api/risk/scores**
Retrieve skor risiko terbaru dan rekomendasi screening

```bash
curl -X GET http://localhost:3000/api/risk/scores \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 🚀 Panduan Penggunaan

### 1. Setup & Konfigurasi

**Environment Variables** (.env.local):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medpredict"

# Authentication
JWT_SECRET="your-super-secret-key-min-32-chars"

# AI & Notifications
GEMINI_API_KEY="your-gemini-key"
FONNTE_API_KEY="your-fonnte-key"
FONNTE_DEVICE_ID="your-device-id"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2. Database Setup

```bash
# Install Prisma CLI
npm install -g prisma

# Create PostgreSQL database
createdb medpredict

# Run migrations
npx prisma migrate dev --name "init"

# Generate Prisma Client
npx prisma generate

# View database UI
npx prisma studio
```

### 3. Menggunakan Risk Calculation API

**Langkah 1: User Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Langkah 2: Isi Health Assessment**
Collect data dari patient:

- Antropometri: height, weight
- Vital signs: blood pressure, blood sugar, cholesterol
- History: family history, medical history, smoking status

**Langkah 3: Call Risk Calculation API**

```bash
curl -X POST http://localhost:3000/api/risk/calculate \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>" \
  -H "Content-Type: application/json" \
  -d '{ ...patient data... }'
```

**Langkah 4: Retrieve Results & Recommendations**

```bash
curl -X GET http://localhost:3000/api/risk/scores \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

---

## 📊 Roadmap Implementasi

### Phase 1: ✅ COMPLETED

- [x] Risk calculation algorithms (4 diseases)
- [x] Alert service dengan WhatsApp integration
- [x] Screening recommendation engine
- [x] API endpoints untuk risk calculation
- [x] Build test success

### Phase 2: 🔄 IN PROGRESS (Database Setup)

- [ ] Prisma migration untuk 7 new models
- [ ] Create POST /api/screening/recommendations
- [ ] Create POST /api/facility/register
- [ ] Health facility dashboard pages
- [ ] Risk assessment form page

### Phase 3: 📋 PLANNED

- [ ] Patient risk dashboard dengan history
- [ ] Health worker dashboard dengan alert management
- [ ] Advanced screening tracking
- [ ] Report generation (PDF)
- [ ] Data export untuk monitoring JKN

### Phase 4: 🎯 FUTURE

- [ ] ML model integration untuk akurasi prediksi
- [ ] Integration dengan data JKN pusat (API BPJS)
- [ ] Mobile app (React Native)
- [ ] Telemedicine consultation integration
- [ ] Analytics dashboard untuk system administrators

---

## 📁 File Implementations

### Services Layer

**lib/services/riskCalculation.ts** (✅ Complete)

- `calculateDiabetesRisk()` - Diabetes scoring
- `calculateHypertensionRisk()` - Hypertension scoring
- `calculateCoronaryHeartRisk()` - CHD scoring
- `calculateStrokeRisk()` - Stroke scoring
- `calculateDiseaseRisks()` - Main orchestrator
- `getUserRiskProfile()` - Retrieve user profile

**lib/services/alert.ts** (✅ Complete)

- `determineSeverity()` - Classify alert level
- `createAlertForHighRisk()` - Create & notify
- `getActiveAlertsForFacility()` - Faskes alerts
- `markAlertAsRead()` - Alert management
- `resolveAlert()` - Track resolution
- `getAlertStatistics()` - Dashboard stats
- `getPatientRiskAlerts()` - Patient notifications

**lib/services/screening.ts** (✅ Complete)

- `generateScreeningRecommendations()` - Personalized recommendations
- `getUserScreeningRecommendations()` - Retrieve recommendations
- `markScreeningAsCompleted()` - Track completion
- `getRecommendationsSummary()` - Dashboard summary
- `getGeneralScreeningAdvice()` - Age-based tips

### API Routes

**app/api/risk/route.ts** (✅ Complete)

- POST: Calculate risk scores
- GET: Retrieve risk scores & recommendations

### Database Models (Prisma Schema)

```prisma
// New models for MedpredictJKN
model MedicalRecord { ... }          // JKN history
model DiseaseRiskScore { ... }        // Risk calculations
model ScreeningRecommendation { ... } // Screening tracking
model HealthFacility { ... }          // Faskes registration
model HealthFacilityUser { ... }      // Health worker accounts
model FaskesAlert { ... }             // Alert records
model RiskAlertLog { ... }            // Audit trail
```

---

## 🔗 Integration Points

### With Existing Features

```javascript
// Existing health check data dapat digunakan
const healthData = await prisma.healthData.findMany({
  where: { userId: "user123" },
});

// Kombinasikan dengan risk scores
const riskProfile = {
  currentBMI: healthData.latest.bmi,
  calculatedRisks: riskScores,
  recommendations: screeningRecommendations,
};
```

### With Gemini Chatbot

```javascript
// Pasien bisa tanya tentang hasil risk assessment
// Chatbot menggunakan risk scores untuk jawaban personal
const chatContext = `
User's risk profile:
- Diabetes Risk: 68%
- Hypertension Risk: 75%
...
`;
```

### With WhatsApp Notifications

```javascript
// Alert otomatis dikirim ke health workers
// Dan bisa dikirim ke pasien juga
const message = `
🚨 ALERT: Risiko Hipertensi 75% (TINGGI)
Segera lakukan screening dan konsultasi dengan dokter.
`;
```

---

## 🧪 Testing

### Manual Testing Checklist

```
[ ] Register new patient account
[ ] Login successfully
[ ] Submit health assessment data
[ ] Verify risk scores calculated correctly
[ ] Confirm alerts created for high-risk diseases
[ ] Check WhatsApp notifications (if configured)
[ ] Retrieve scores via GET endpoint
[ ] Verify recommendations generated
[ ] Test with different risk profiles
```

### Example Test Cases

**Test Case 1: High-Risk Patient**

```json
{
  "age": 55,
  "gender": "male",
  "height": 165,
  "weight": 95,
  "bloodPressure": { "systolic": 160, "diastolic": 100 },
  "cholesterol": 280,
  "bloodSugar": 135,
  "smoker": true,
  "familyHistory": ["Diabetes", "Heart Disease", "Stroke"],
  "medicalHistory": ["Hypertension"]
}
```

Expected: HIGH risk scores for all 4 diseases, CRITICAL/HIGH alerts triggered

**Test Case 2: Low-Risk Patient**

```json
{
  "age": 30,
  "gender": "female",
  "height": 160,
  "weight": 55,
  "bloodPressure": { "systolic": 115, "diastolic": 75 },
  "cholesterol": 180,
  "bloodSugar": 85,
  "smoker": false,
  "familyHistory": [],
  "medicalHistory": []
}
```

Expected: LOW risk scores, no alerts triggered

---

## 📞 Support & Troubleshooting

### Common Issues

**1. Build Error: Cannot find module 'prisma'**

```bash
# Regenerate Prisma Client
npx prisma generate
```

**2. Database Connection Failed**

```bash
# Check connection string
# Verify PostgreSQL is running
# psql your-connection-string
```

**3. WhatsApp Notifications Not Sending**

- Verify FONNTE_API_KEY in .env.local
- Check if device is registered at Fonnte
- Verify phone number format (international)

**4. JWT Token Expired**

- Implement token refresh mechanism
- Currently tokens valid for 30 days
- Consider shorter expiration for security

---

## 📚 References

- **Diabetes Risk Scoring**: Finnish Diabetes Risk Score (FINDRISC)
- **CVD Risk**: Framingham Risk Score adaptation
- **Hypertension**: ACC/AHA Guidelines
- **Stroke Risk**: Framingham Stroke Profile

---

## 📝 License & Notes

Project: MedpredictJKN  
Version: 1.0.0-beta  
Status: Ready for Prisma Migration & Database Setup  
Last Updated: January 2025

**Next Steps:**

1. Setup PostgreSQL database
2. Run Prisma migrations
3. Configure FONNTE API for WhatsApp
4. Build health facility dashboard
5. Deploy to production

---

_Dikembangkan untuk meningkatkan deteksi dini penyakit kronis dan kualitas layanan kesehatan melalui sistem JKN._
