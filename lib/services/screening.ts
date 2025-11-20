/**
 * Screening Recommendation Engine (In-Memory Version)
 * Generate personalized screening tests dan lifestyle advice berdasarkan disease risk
 * 
 * Database persistence akan diimplementasikan setelah Prisma migration selesai
 * 
 * Features:
 * - Personalized screening recommendations per disease
 * - Lifestyle advice dan prevention tips
 * - Priority-based recommendations (dari critical ke medium)
 */

interface ScreeningRecommendationData {
  userId: string;
  disease: string;
  riskScore: number;
  severity: "critical" | "high" | "medium";
  recommendedTests: string[];
  recommendationFrequency: string;
  lifestyleAdvice: string[];
  priority: number;
}

interface GenerateRecommendationPayload {
  userId: string;
  diabetes2Score: number;
  hypertensionScore: number;
  coronaryHeartScore: number;
  strokeScore: number;
  age: number;
  bmi?: number;
  smoker?: boolean;
}

// Screening test recommendations per disease
const SCREENING_RECOMMENDATIONS: Record<string, {
  tests: string[];
  frequency: string;
  lifestyleAdvice: string[];
  priority: number;
}> = {
  "Diabetes Mellitus Tipe 2": {
    tests: [
      "Fasting Blood Sugar Test",
      "HbA1c Test",
      "Oral Glucose Tolerance Test (OGTT)",
      "Lipid Panel",
    ],
    frequency: "Every 6 months if score > 70%",
    lifestyleAdvice: [
      "Kurangi asupan gula dan karbohidrat sederhana",
      "Olahraga teratur minimal 150 menit per minggu",
      "Jaga berat badan ideal",
      "Kelola stres dengan baik",
      "Hindari minuman bergula",
      "Perbanyak konsumsi serat",
    ],
    priority: 5,
  },
  Hipertensi: {
    tests: [
      "Blood Pressure Monitoring (daily)",
      "24-hour Ambulatory Blood Pressure Monitoring",
      "Kidney Function Tests",
      "Lipid Panel",
      "ECG (Electrocardiogram)",
    ],
    frequency: "Every 3 months",
    lifestyleAdvice: [
      "Kurangi konsumsi garam (< 2.3g per hari)",
      "Olahraga rutin 30 menit setiap hari",
      "Kelola berat badan",
      "Hindari alkohol berlebihan",
      "Kelola stres dengan meditasi/yoga",
      "Perbanyak konsumsi kalium dan magnesium",
    ],
    priority: 5,
  },
  "Jantung Koroner": {
    tests: [
      "Stress Test/Treadmill Test",
      "Coronary CT Angiography",
      "Troponin Blood Test",
      "Lipid Panel",
      "ECG",
      "Echocardiogram",
    ],
    frequency: "Every 3-6 months",
    lifestyleAdvice: [
      "Hindari makanan tinggi lemak jenuh",
      "Olahraga kardio 150 menit/minggu",
      "Berhenti merokok (jika perokok)",
      "Kelola kolesterol dengan diet sehat",
      "Kelola stres",
      "Istirahat cukup 7-9 jam per malam",
    ],
    priority: 4,
  },
  Stroke: {
    tests: [
      "Carotid Ultrasound",
      "Brain MRI",
      "Echocardiogram",
      "Blood Pressure Monitoring",
      "Lipid Panel",
      "Blood Glucose Test",
    ],
    frequency: "Every 3-6 months if high risk",
    lifestyleAdvice: [
      "Kontrol tekanan darah secara ketat",
      "Kelola kolesterol tinggi",
      "Berhenti merokok",
      "Hindari alkohol berlebihan",
      "Olahraga teratur",
      "Kelola diabetes jika ada",
      "Hindari stres kronis",
    ],
    priority: 4,
  },
};

// Generate personalized screening recommendations
export async function generateScreeningRecommendations(
  payload: GenerateRecommendationPayload
): Promise<ScreeningRecommendationData[]> {
  const {
    userId,
    diabetes2Score,
    hypertensionScore,
    coronaryHeartScore,
    strokeScore,
    age,
    bmi,
    smoker,
  } = payload;

  const recommendations: ScreeningRecommendationData[] = [];
  const riskThreshold = 70;

  // Map disease risks to recommendations
  const diseaseRisks = [
    { disease: "Diabetes Mellitus Tipe 2", score: diabetes2Score },
    { disease: "Hipertensi", score: hypertensionScore },
    { disease: "Jantung Koroner", score: coronaryHeartScore },
    { disease: "Stroke", score: strokeScore },
  ];

  // Sort by score (highest first)
  diseaseRisks.sort((a, b) => b.score - a.score);

  for (const { disease, score } of diseaseRisks) {
    if (score >= riskThreshold) {
      const recommendation = SCREENING_RECOMMENDATIONS[disease];
      if (recommendation) {
        // Add additional lifestyle advice based on risk factors
        const lifestyleAdvice = [...recommendation.lifestyleAdvice];

        // Personalized advice based on risk factors
        if (smoker) {
          lifestyleAdvice.push("⚠️ PRIORITAS: Berhenti merokok sangat penting!");
        }
        if (bmi && bmi >= 30) {
          lifestyleAdvice.push("⚠️ PRIORITAS: Turunkan berat badan ke BMI < 25");
        }
        if (age >= 60) {
          lifestyleAdvice.push(
            "⚠️ Intensifkan pemantauan karena usia > 60 tahun"
          );
        }

        const rec: ScreeningRecommendationData = {
          userId,
          disease,
          riskScore: score,
          severity:
            score >= 85 ? "critical" : score >= 70 ? "high" : "medium",
          recommendedTests: recommendation.tests,
          recommendationFrequency: recommendation.frequency,
          lifestyleAdvice,
          priority: recommendation.priority,
        };

        recommendations.push(rec);
      }
    }
  }

  return recommendations;
}

// Get user's active screening recommendations (stub for future DB integration)
export async function getUserScreeningRecommendations(
  _userId: string
): Promise<ScreeningRecommendationData[]> {
  // TODO: Implement database queries after migration
  return [];
}

// Mark screening as completed (stub for future DB integration)
export async function markScreeningAsCompleted(
  _recommendationId: string,
  _completionNotes?: string
): Promise<ScreeningRecommendationData | null> {
  // TODO: Implement database update after migration
  return null;
}

// Get recommendations summary for dashboard
export function getRecommendationsSummary(
  recommendations: ScreeningRecommendationData[]
): Record<string, unknown> {
  const summary = {
    total: recommendations.length,
    completed: 0,
    pending: recommendations.length,
    byCriticalityAndCompleteness: {
      criticalPending: recommendations.filter(
        (r: ScreeningRecommendationData) => r.severity === "critical"
      ).length,
      highPending: recommendations.filter(
        (r: ScreeningRecommendationData) => r.severity === "high"
      ).length,
      mediumPending: recommendations.filter(
        (r: ScreeningRecommendationData) => r.severity === "medium"
      ).length,
    },
    topDiseases: recommendations
      .sort((a: ScreeningRecommendationData, b: ScreeningRecommendationData) => b.riskScore - a.riskScore)
      .slice(0, 3)
      .map((r: ScreeningRecommendationData) => ({ disease: r.disease, riskScore: r.riskScore })),
  };

  return summary;
}

// General health screening tips
export function getGeneralScreeningAdvice(): Record<string, string[]> {
  return {
    "Untuk Semua Usia": [
      "Lakukan pemeriksaan kesehatan rutin setahun sekali",
      "Vaksinasi sesuai jadwal nasional",
      "Pertahankan pola makan sehat seimbang",
      "Olahraga minimal 150 menit per minggu",
      "Kelola stres dengan baik",
      "Tidur cukup 7-9 jam setiap malam",
      "Hindari rokok dan alkohol berlebihan",
      "Monitor berat badan secara berkala",
    ],
    "Usia 30-40 tahun": [
      "Screening tekanan darah setiap tahun",
      "Cholesterol screening setiap 4-6 tahun",
      "Blood sugar testing",
      "Cancer screening mulai pada usia 40",
    ],
    "Usia 40-50 tahun": [
      "Screening tekanan darah setiap tahun",
      "Cholesterol screening setiap 2 tahun",
      "Diabetes screening setiap 3 tahun",
      "ECG dasar",
    ],
    "Usia 50+ tahun": [
      "Screening tekanan darah 3-6 bulan",
      "Cholesterol monitoring teratur",
      "Diabetes screening setiap tahun",
      "Cardiac screening sesuai faktor risiko",
      "Cancer screening (colorectal, breast, prostate)",
    ],
  };
}
