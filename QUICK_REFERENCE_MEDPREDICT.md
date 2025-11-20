# MedpredictJKN - Quick Reference Card

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Clone and install
npm install

# Create .env.local with:
DATABASE_URL="postgresql://..."
JWT_SECRET="min-32-characters-secret-key"
GEMINI_API_KEY="your-key"
FONNTE_API_KEY="your-key"
```

### 2. Database Setup

```bash
# Create database
createdb medpredict

# Run migrations
npx prisma migrate dev --name "init"

# Generate client
npx prisma generate
```

### 3. Run Application

```bash
npm run dev
# Open http://localhost:3000
```

---

## 📊 Risk Calculation Quick Reference

### 4 Diseases Covered

| Disease            | Score Range | Alert Threshold | Max Factors |
| ------------------ | ----------- | --------------- | ----------- |
| **Diabetes**       | 0-100       | ≥70%            | 9           |
| **Hypertension**   | 0-100       | ≥70%            | 8           |
| **Coronary Heart** | 0-100       | ≥70%            | 8           |
| **Stroke**         | 0-100       | ≥70%            | 8           |

### Alert Severity Levels

```
CRITICAL: Score ≥ 85%  🔴 Immediate action needed
HIGH:     Score ≥ 70%  🟠 Schedule screening soon
MEDIUM:   Score ≥ 50%  🟡 Monitor & prevent
```

---

## 🔌 API Endpoints

### POST /api/risk/calculate

**Calculate disease risk scores**

```bash
curl -X POST http://localhost:3000/api/risk/calculate \
  -H "Authorization: Bearer <TOKEN>" \
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
    "medicalHistory": ["Hypertension"]
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "diabetes2Score": 68,
    "hypertensionScore": 75,
    "coronaryHeartScore": 72,
    "strokeScore": 65,
    "highRiskDiseases": ["Hipertensi", "Jantung Koroner"],
    "alertSent": true
  }
}
```

### GET /api/risk/scores

**Retrieve user's latest risk scores**

```bash
curl -X GET http://localhost:3000/api/risk/scores \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🏗️ File Structure - Key Services

```
lib/services/
├── riskCalculation.ts
│   ├── calculateDiabetesRisk(factors) → number
│   ├── calculateHypertensionRisk(factors) → number
│   ├── calculateCoronaryHeartRisk(factors) → number
│   ├── calculateStrokeRisk(factors) → number
│   └── calculateDiseaseRisks(payload) → DiseaseRiskScoreData
│
├── alert.ts
│   ├── determineSeverity(riskScore) → "critical" | "high" | "medium"
│   ├── createAlertForHighRisk(payload) → Promise<{success, severity}>
│   └── getActiveAlertsForFacility(facilityId) → Promise<Alert[]>
│
└── screening.ts
    ├── generateScreeningRecommendations(payload) → Promise<Recommendation[]>
    └── getGeneralScreeningAdvice() → {ageGroup: string[]}
```

---

## 💾 Database Models Summary

```prisma
// User enriched with relationships
User
  ├── healthData[]
  ├── medicalRecords[]
  ├── riskScores (1:1)
  └── screeningRecommendations[]

// New 7 models
MedicalRecord          # JKN history
DiseaseRiskScore       # Risk calculations
ScreeningRecommendation # Screening tracking
HealthFacility         # Faskes registration
HealthFacilityUser     # Health workers
FaskesAlert            # Alert records
RiskAlertLog           # Audit trail
```

---

## 🧪 Testing Guide

### Manual Test: Calculate Risk

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 2. Copy token from response

# 3. Calculate risk
curl -X POST http://localhost:3000/api/risk/calculate \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>" \
  -H "Content-Type: application/json" \
  -d '{...patient data...}'
```

### Expected Behavior

- ✅ High-risk scores (≥70%) trigger HIGH/CRITICAL alerts
- ✅ Low-risk scores (< 50%) no alerts
- ✅ Recommendations generated for each high-risk disease
- ✅ WhatsApp message logged (check console if Fonnte not configured)

---

## 🔧 Common Commands

```bash
# Development
npm run dev               # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio       # Open database UI
npx prisma generate     # Regenerate client
npx prisma migrate dev   # Create migration
npx prisma db push      # Push schema to DB

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix lint issues
```

---

## 📋 Input Requirements

### For Risk Calculation API

**Required fields:**

- age (number, 18-120)
- gender (string: "male" | "female")
- height (number, cm)
- weight (number, kg)
- bloodPressure (object: {systolic, diastolic})

**Optional fields:**

- cholesterol (number, mg/dL)
- bloodSugar (number, mg/dL)
- smoker (boolean)
- familyHistory (string[])
- medicalHistory (string[])

### Valid Family History Values

- "Diabetes"
- "Hypertension"
- "Heart Disease"
- "Stroke"

### Valid Medical History Values

- "Diabetes"
- "Hypertension"
- "Heart Disease"
- "Stroke"
- "Atrial Fibrillation"
- "LVH"
- "Kidney Disease"

---

## 🐛 Debugging Tips

### Check Risk Calculation

```javascript
// In browser console
fetch('/api/risk/calculate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...test data...})
}).then(r => r.json()).then(console.log)
```

### View Database

```bash
npx prisma studio
# Navigate to different models to see data
```

### Check Logs

```bash
# Look for console.log in services
# Search for [ALERT], [WhatsApp], [Risk Assessment]
```

---

## 📊 Example Patient Profiles

### High-Risk Patient (All Alerts)

```json
{
  "age": 60,
  "gender": "male",
  "height": 165,
  "weight": 95,
  "bloodPressure": { "systolic": 160, "diastolic": 100 },
  "cholesterol": 280,
  "bloodSugar": 140,
  "smoker": true,
  "familyHistory": ["Diabetes", "Heart Disease", "Stroke"],
  "medicalHistory": ["Hypertension"]
}
```

Expected: All scores 75-85%, Multiple alerts

### Low-Risk Patient (No Alerts)

```json
{
  "age": 25,
  "gender": "female",
  "height": 165,
  "weight": 60,
  "bloodPressure": { "systolic": 115, "diastolic": 75 },
  "cholesterol": 180,
  "bloodSugar": 85,
  "smoker": false,
  "familyHistory": [],
  "medicalHistory": []
}
```

Expected: All scores < 50%, No alerts

### Borderline Patient (Some Alerts)

```json
{
  "age": 50,
  "gender": "male",
  "height": 175,
  "weight": 82,
  "bloodPressure": { "systolic": 135, "diastolic": 85 },
  "cholesterol": 220,
  "bloodSugar": 105,
  "smoker": false,
  "familyHistory": ["Diabetes"],
  "medicalHistory": ["Hypertension"]
}
```

Expected: Mixed scores (50-75%), Selective alerts

---

## 🔐 Security Checklist

- [ ] JWT_SECRET set to 32+ characters
- [ ] DATABASE_URL uses strong password
- [ ] Environment variables not in git
- [ ] API endpoints check authentication
- [ ] User can only access own data
- [ ] WhatsApp API key in .env (not hardcoded)

---

## 📚 Related Files

| File                       | Purpose                            |
| -------------------------- | ---------------------------------- |
| `MEDPREDICT_JKN_GUIDE.md`  | Comprehensive implementation guide |
| `IMPLEMENTATION_STATUS.md` | Detailed project status report     |
| `README.md`                | Project overview                   |
| `API_TESTING.md`           | API testing procedures             |
| `SETUP.md`                 | Setup instructions                 |

---

## 🎯 Next Steps

1. ✅ Risk calculation complete
2. 🔄 Setup PostgreSQL database
3. 🔄 Run Prisma migrations
4. 🔄 Create risk assessment form (Frontend)
5. 🔄 Build patient risk dashboard
6. 🔄 Configure WhatsApp notifications
7. 🔄 Create health facility dashboard

---

## 💡 Pro Tips

1. **Fast Testing**: Use `curl` in terminal for quick API tests
2. **Database UI**: `npx prisma studio` is easier than SQL queries
3. **Type Safety**: Always check TypeScript types before calling APIs
4. **Error Logs**: Check console.logs for [ALERT] and [Risk Assessment] messages
5. **Screening Logic**: Check `SCREENING_RECOMMENDATIONS` object in screening.ts for customization

---

## 📞 Quick Support

**Build Error?**

```bash
npx prisma generate && npm run build
```

**Database Error?**

```bash
# Check connection
psql $DATABASE_URL

# Reset database
dropdb medpredict && createdb medpredict && npx prisma migrate dev
```

**API Not Responding?**

```bash
# Check JWT token is valid
# Verify Authorization header format: "Bearer <TOKEN>"
# Ensure user is logged in first
```

---

**Version**: 1.0.0-beta | **Last Updated**: January 2025

_For full documentation, see MEDPREDICT_JKN_GUIDE.md and IMPLEMENTATION_STATUS.md_
