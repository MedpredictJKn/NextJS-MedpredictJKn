import { prisma } from "@/lib/db";
import { retryWithBackoff } from "@/lib/utils";

// General Knowledge Base tentang Aplikasi
const _APPLICATION_KNOWLEDGE = `
TENTANG APLIKASI MedpredictJKn:

Nama Aplikasi: MedpredictJKn - Sistem Prediksi Dini Risiko Penyakit Berbasis AI/ML
Deskripsi: Platform kesehatan digital yang menggunakan kecerdasan buatan untuk memprediksi risiko penyakit kronis dan memberikan rekomendasi intervensi kesehatan yang dipersonalisasi untuk peserta JKN (Jaminan Kesehatan Nasional).

MENU UTAMA PATIENT (PENGGUNA):

1. Dashboard
   - Ringkasan status kesehatan
   - Data riwayat kesehatan terbaru
   - Akses cepat ke fitur-fitur utama

2. Cek Kesehatan & Analisis Risiko
   - Input data kesehatan: tinggi badan, berat badan, tekanan darah, gula darah, kolesterol
   - Perhitungan otomatis BMI dan status berat badan
   - Analisis risiko penyakit menggunakan AI:
     * Diabetes Melitus Tipe 2
     * Hipertensi
     * Penyakit Jantung Koroner
   - Rekomendasi skrining kesehatan spesifik (minimal 4 rekomendasi)
   - Saran gaya hidup terpersonalisasi

3. Chat AI Kesehatan
   - Konsultasi kesehatan dengan chatbot bertenaga AI
   - Tanya jawab tentang kesehatan, pencegahan penyakit, gaya hidup sehat
   - Dukungan 24/7 dalam Bahasa Indonesia
   - Integrasi dengan data kesehatan pengguna

4. Profil Saya
   - Kelola informasi pribadi
   - Upload foto profil
   - Lihat riwayat kesehatan
   - Pengaturan akun

FITUR-FITUR UTAMA:

1. Model Prediksi Dini Risiko Penyakit (Early Risk Prediction)
   - AI/Machine Learning dilatih menggunakan dataset JKN (riwayat diagnosa, obat, kunjungan, hasil lab)
   - Menghitung skor risiko individual (0-100 scale) untuk penyakit umum
   - Tingkat Risiko: Rendah (0-30), Sedang (31-60), Tinggi (61-100)
   - Manfaat: Mengidentifikasi individu sebelum menunjukkan gejala parah, memungkinkan intervensi gaya hidup atau pengobatan preventif

2. Sistem Alert & Notifikasi Otomatis
   - Mengirimkan peringatan kepada peserta JKN melalui aplikasi mobile/SMS
   - Notifikasi ke fasilitas kesehatan (Faskes) primer terkait
   - Triggered ketika skor risiko pasien melebihi ambang batas
   - Manfaat: Mendorong pasien segera melakukan skrining di Faskes terdekat (pencegahan)

3. Rekomendasi Skrining & Intervensi Spesifik
   - Setelah mengidentifikasi risiko, AI merekomendasikan:
     * Jenis pemeriksaan penunjang relevan (GDP, EKG, profil lipid, dll)
     * Estimasi biaya pemeriksaan
     * Lokasi fasilitas kesehatan terdekat
     * Saran modifikasi gaya hidup yang dipersonalisasi (nutrisi, olahraga, stres management)
   - Manfaat: Efisiensi pemeriksaan, hindari pemeriksaan tidak perlu, intervensi tepat sasaran

4. Dashboard Tenaga Kesehatan (Dokter)
   - Antarmuka untuk dokter/perawat di Faskes
   - Melihat daftar pasien dengan risiko tertinggi
   - Riwayat JKN singkat setiap pasien
   - Rekomendasi skrining AI terintegrasi
   - Fitur monitoring pasien dan pengiriman pesan
   - Manfaat: Membantu dokter memprioritaskan pasien yang membutuhkan perhatian segera

TEKNOLOGI:
- Framework: Next.js 16 dengan TypeScript
- AI/ML: Gemini API untuk natural language processing dan analisis kesehatan
- Database: PostgreSQL dengan Prisma ORM
- Authentication: JWT Token-based
- Real-time: WhatsApp Integration untuk notifikasi

KEUNTUNGAN MENGGUNAKAN MedpredictJKn:
✓ Deteksi dini risiko penyakit kronis sebelum gejala parah
✓ Rekomendasi kesehatan yang dipersonalisasi berdasarkan data individual
✓ Akses mudah ke informasi kesehatan dan konsultasi AI 24/7
✓ Integrasi dengan sistem JKN untuk data medis komprehensif
✓ Membantu dokter di daerah dengan SDM terbatas
✓ Mendorong perilaku hidup sehat melalui notifikasi dan rekomendasi
✓ Menghemat biaya kesehatan dengan pencegahan dan skrining tepat sasaran
`;

export async function saveChatHistory(
  userId: string,
  message: string,
  response: string,
  source: "fastapi" | "gemini",
  sessionId?: string
) {
  // Generate sessionId if not provided
  const finalSessionId = sessionId || `session-${Date.now()}`;
  
  return retryWithBackoff(
    () =>
      prisma.chatHistory.create({
        data: {
          userId,
          sessionId: finalSessionId,
          message,
          response,
          source,
        },
      }),
    3
  );
}

export async function getChatHistory(userId: string, limit: number = 20) {
  return prisma.chatHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// Function untuk prediksi penyakit berdasarkan gejala
export function getEnhancedPrompt(userMessage: string): string {
  return `Anda adalah dokter/tenaga kesehatan yang ahli dalam prediksi risiko penyakit kronis berdasarkan gejala dan riwayat kesehatan.

PENYAKIT YANG DIPREDIKSI:
1. Diabetes Melitus Tipe 2 (DMT2)
2. Hipertensi (Tekanan Darah Tinggi)
3. Penyakit Jantung Koroner (PJK)

TUGAS ANDA:
1. Analisis gejala atau kondisi kesehatan yang dilaporkan user
2. Prediksi penyakit mana dari ketiga penyakit di atas yang relevan berdasarkan gejala (bisa 1, 2, atau 3 penyakit)
3. Jelaskan hubungan antara gejala dengan penyakit yang diprediksi
4. Berikan penjelasan singkat tentang penyakit tersebut
5. Berikan saran umum tentang pencegahan atau pengelolaan kesehatan

INSTRUKSI PENTING:
- Hanya prediksi dari 3 penyakit: Diabetes Melitus Tipe 2, Hipertensi, atau Penyakit Jantung Koroner
- Prediksi bisa 1, 2, atau 3 penyakit tergantung relevansi dengan gejala user
- Jangan berikan diagnosis resmi atau resep obat
- Balas dalam Bahasa Indonesia yang jelas dan mudah dipahami
- Fokus pada analisis gejala dan prediksi penyakit

Gejala/Kondisi Pengguna: ${userMessage}

Berikan prediksi penyakit berdasarkan informasi di atas.`;
}

// Mock function - replace dengan actual FastAPI call
export async function callFastAPIChatbot(message: string): Promise<string> {
  try {
    const fastApiUrl = process.env.FASTAPI_URL || "https://medpredictjkn.vercel.app";
    const response = await fetch(`${fastApiUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("FastAPI error");
    const data = await response.json();
    return data.response || "Tidak ada respons";
  } catch {
    return "Maaf, chatbot sedang tidak tersedia.";
  }
}

// Call Gemini API using URL from .env
export async function callGeminiChatbot(message: string): Promise<string> {
  try {
    const apiKey = process.env.FAST_API_KEY;
    const apiUrl = process.env.FAST_API_URL;

    if (!apiKey) throw new Error("FAST_API_KEY not configured");
    if (!apiUrl) throw new Error("FAST_API_URL not configured");

    const urlWithKey = `${apiUrl}?key=${apiKey}`;
    
    // Get enhanced prompt with application knowledge
    const enhancedPrompt = getEnhancedPrompt(message);

    const response = await fetch(urlWithKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      throw new Error(`Gemini API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      console.error("No text content in Gemini response:", data);
      throw new Error("No response text from Gemini");
    }

    return textContent;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
}
