'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IoSend, IoCheckmarkDone } from 'react-icons/io5';
import { Check, X, Phone, MessageSquare, Info, AlertTriangle, ArrowLeft, Send } from 'lucide-react';

interface NotificationResult {
  success: boolean;
  message?: string;
  error?: string;
  messageId?: string;
  timestamp?: string;
}

export default function NotifikasiWAPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>('62');
  const [messageBody, setMessageBody] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NotificationResult | null>(null);
  const [messageType, setMessageType] = useState<
    'custom' | 'alert' | 'screening' | 'verification'
  >('custom');
  const [riskData, setRiskData] = useState<{
    disease: string;
    riskScore: number;
  }[]>([{ disease: 'Hipertensi', riskScore: 75 }]);
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium'>(
    'high'
  );

  const generateAlertMessage = () => {
    const severityLabel =
      severity === 'critical'
        ? 'KRITIS'
        : severity === 'high'
          ? 'TINGGI'
          : 'SEDANG';

    const diseaseList = riskData.map((d) => `• ${d.disease}: ${d.riskScore}%`).join('\n');

    return `
${severityLabel} - ALERT KESEHATAN ANDA

Risiko Penyakit Terdeteksi:
${diseaseList}

SEGERA LAKUKAN:
• Konsultasi dengan dokter
• Lakukan pemeriksaan kesehatan
• Ikuti rekomendasi screening

Buka aplikasi MedpredictJKN untuk detail lengkap

---
MedpredictJKN - Sistem Prediksi Risiko Penyakit
    `.trim();
  };

  const generateVerificationMessage = () => {
    const code = Math.random().toString().slice(2, 8);
    return `Kode verifikasi MedpredictJKN Anda: ${code}\n\nJangan bagikan kode ini kepada siapapun.`;
  };

  const sendNotification = async () => {
    if (!phoneNumber || phoneNumber === '62') {
      alert('Masukkan nomor WhatsApp yang valid');
      return;
    }

    let finalMessage = messageBody;

    if (messageType === 'alert') {
      finalMessage = generateAlertMessage();
    } else if (messageType === 'verification') {
      finalMessage = generateVerificationMessage();
    }

    if (!finalMessage) {
      alert('Masukkan pesan terlebih dahulu');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/notify-wa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          body: finalMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Pesan berhasil dikirim!',
          messageId: data.message?.id,
          timestamp: new Date().toISOString(),
        });
        setMessageBody('');
      } else {
        setResult({
          success: false,
          error: data.error || 'Gagal mengirim pesan',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <div className="flex items-start gap-4">
            <div className="bg-linear-to-br from-green-600 to-emerald-600 p-3 rounded-full">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Notifikasi WhatsApp
              </h1>
              <p className="text-gray-600">
                Kirim notifikasi kesehatan melalui WhatsApp dengan WhAPI.cloud
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Tipe Notifikasi</CardTitle>
                <CardDescription>Pilih jenis notifikasi yang ingin dikirim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'custom', label: 'Custom', desc: 'Pesan khusus' },
                    { value: 'alert', label: 'Alert', desc: 'Alert risiko' },
                    { value: 'screening', label: 'Screening', desc: 'Screening' },
                    { value: 'verification', label: 'Verifikasi', desc: 'Kode verifikasi' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setMessageType(
                          type.value as
                          | 'custom'
                          | 'alert'
                          | 'screening'
                          | 'verification'
                        )
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-center ${messageType === type.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div className="text-lg mb-1 font-bold text-gray-800">{type.label}</div>
                      <div className="text-xs font-medium text-gray-600">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Severity Selection */}
            {messageType === 'alert' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Tingkat Keparahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {[
                      { value: 'critical' as const, label: 'KRITIS', color: 'border-red-500 bg-red-50' },
                      { value: 'high' as const, label: 'TINGGI', color: 'border-orange-500 bg-orange-50' },
                      { value: 'medium' as const, label: 'SEDANG', color: 'border-yellow-500 bg-yellow-50' },
                    ].map((sev) => (
                      <button
                        key={sev.value}
                        onClick={() => setSeverity(sev.value)}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${severity === sev.value
                            ? `border-2 ${sev.color}`
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        {sev.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Data */}
            {messageType === 'alert' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Data Risiko Penyakit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskData.map((risk, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Input
                        type="text"
                        value={risk.disease}
                        onChange={(e) => {
                          const newData = [...riskData];
                          newData[idx].disease = e.target.value;
                          setRiskData(newData);
                        }}
                        placeholder="Nama penyakit"
                        className="flex-1 h-10"
                      />
                      <Input
                        type="number"
                        value={risk.riskScore}
                        onChange={(e) => {
                          const newData = [...riskData];
                          newData[idx].riskScore = parseInt(e.target.value) || 0;
                          setRiskData(newData);
                        }}
                        placeholder="Skor %"
                        min="0"
                        max="100"
                        className="w-24 h-10"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setRiskData([
                        ...riskData,
                        { disease: '', riskScore: 0 },
                      ])
                    }
                    variant="outline"
                    className="w-full h-10"
                  >
                    + Tambah Penyakit
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Phone Number */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Nomor WhatsApp Tujuan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (!val.startsWith('62')) {
                      val = '62' + val;
                    }
                    setPhoneNumber(val);
                  }}
                  placeholder="62xxxxxxxxxx"
                  className="h-11"
                />
                <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                  Format: 62 + nomor (tanpa 0 di awal). Contoh: 628123456789
                </p>
              </CardContent>
            </Card>

            {/* Message Body */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Isi Pesan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={
                    messageType === 'alert'
                      ? generateAlertMessage()
                      : messageType === 'verification'
                        ? generateVerificationMessage()
                        : messageBody
                  }
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Tulis pesan WhatsApp Anda di sini..."
                  disabled={messageType !== 'custom'}
                  className="h-32"
                />
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Karakter: {messageType === 'custom' ? messageBody.length : generateAlertMessage().length}</span>
                  <span className={messageType === 'custom' ? '' : 'text-gray-400'}>
                    {messageType !== 'custom' ? 'Template otomatis' : 'Pesan khusus'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Send Button */}
            <Button
              onClick={sendNotification}
              disabled={loading}
              className="w-full h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              {loading ? 'Mengirim...' : 'Kirim Notifikasi'}
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Status Sistem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">WhAPI Connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Database Ready</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">API Aktif</span>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            {result && (
              <Card className={`border-2 ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                } shadow-lg`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <IoCheckmarkDone className="text-3xl text-green-600 shrink-0" />
                    ) : (
                      <X className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-bold mb-2 ${result.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {result.success ? 'Berhasil!' : 'Gagal'}
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        {result.message || result.error}
                      </p>
                      {result.messageId && (
                        <div className="bg-white p-2 rounded text-xs text-gray-600 break-all border border-gray-200">
                          <strong>ID:</strong> {result.messageId}
                        </div>
                      )}
                      {result.timestamp && (
                        <p className="text-xs text-gray-600 mt-3">
                          {new Date(result.timestamp).toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card className="border-0 shadow-lg bg-linear-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Tips & Panduan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <div className="flex gap-2">
                  <span>•</span>
                  <span>Gunakan format nomor dengan kode negara 62</span>
                </div>
                <div className="flex gap-2">
                  <span>•</span>
                  <span>Pastikan nomor terdaftar WhatsApp aktif</span>
                </div>
                <div className="flex gap-2">
                  <span>•</span>
                  <span>API WhAPI.cloud harus aktif dan terkonfigurasi</span>
                </div>
                <div className="flex gap-2">
                  <span>•</span>
                  <span>Pesan dikirim real-time ke nomor tujuan</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
