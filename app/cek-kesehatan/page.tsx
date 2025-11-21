"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ArrowLeft, Activity, TrendingUp, Heart, Droplets, Pill } from "lucide-react";

interface HealthData {
    height: number;
    weight: number;
    bloodPressure?: string;
    bloodSugar?: number;
    cholesterol?: number;
    notes?: string;
}

interface HealthResponse {
    bmi: number;
    status: string;
    height: number;
    weight: number;
}

export default function CekKesehatanPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [token, setToken] = useState("");
    const [result, setResult] = useState<HealthResponse | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const [formData, setFormData] = useState<HealthData>({
        height: 0,
        weight: 0,
        bloodPressure: "",
        bloodSugar: undefined,
        cholesterol: undefined,
        notes: "",
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/auth/login");
            return;
        }
        setToken(storedToken);
        setIsCheckingAuth(false);
    }, [router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "bloodSugar" || name === "cholesterol"
                    ? value
                        ? parseFloat(value)
                        : undefined
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!formData.height || !formData.weight) {
            setError("Tinggi dan berat badan harus diisi");
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError("Token tidak ditemukan, silahkan login ulang");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/health", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Gagal menyimpan data kesehatan");
                return;
            }

            setSuccess("Data kesehatan berhasil disimpan!");
            setResult({
                bmi: data.data.bmi,
                status: data.data.status,
                height: data.data.height,
                weight: data.data.weight,
            });

            setFormData({
                height: 0,
                weight: 0,
                bloodPressure: "",
                bloodSugar: undefined,
                cholesterol: undefined,
                notes: "",
            });
        } catch (err) {
            setError(String(err) || "Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "normal":
                return "text-green-600";
            case "underweight":
                return "text-blue-600";
            case "overweight":
                return "text-yellow-600";
            case "obese":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "normal":
                return "bg-green-50 border-green-200";
            case "underweight":
                return "bg-blue-50 border-blue-200";
            case "overweight":
                return "bg-yellow-50 border-yellow-200";
            case "obese":
                return "bg-red-50 border-red-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "normal":
                return "Berat Badan Normal";
            case "underweight":
                return "Berat Badan Kurang";
            case "overweight":
                return "Berat Badan Berlebih";
            case "obese":
                return "Obesitas";
            default:
                return "Status Tidak Diketahui";
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
                <div className="text-center space-y-4">
                    <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="text-gray-600 font-medium">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-full">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Cek Kesehatan</h1>
                            <p className="text-xs text-gray-600">Periksa data kesehatan dan risiko penyakit Anda</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
                {/* Messages */}
                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200 mb-6">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-green-700 text-sm">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                            <CardHeader>
                                <CardTitle>Data Kesehatan Anda</CardTitle>
                                <CardDescription>Isi form untuk mendapatkan analisis kesehatan</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Measurements */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-blue-600" />
                                            Pengukuran Dasar
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Tinggi Badan (cm) *
                                                </label>
                                                <Input
                                                    type="number"
                                                    name="height"
                                                    value={formData.height || ""}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    step="0.1"
                                                    placeholder="170"
                                                    className="h-10"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Berat Badan (kg) *
                                                </label>
                                                <Input
                                                    type="number"
                                                    name="weight"
                                                    value={formData.weight || ""}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    step="0.1"
                                                    placeholder="65"
                                                    className="h-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vital Signs */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Droplets className="w-5 h-5 text-red-600" />
                                            Tanda Vital
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Tekanan Darah
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="bloodPressure"
                                                    value={formData.bloodPressure || ""}
                                                    onChange={handleChange}
                                                    placeholder="120/80"
                                                    className="h-10"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Gula Darah (mg/dL)
                                                </label>
                                                <Input
                                                    type="number"
                                                    name="bloodSugar"
                                                    value={formData.bloodSugar || ""}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="0.1"
                                                    placeholder="100"
                                                    className="h-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other Measurements */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Pill className="w-4 h-4" />
                                            Kolesterol (mg/dL)
                                        </label>
                                        <Input
                                            type="number"
                                            name="cholesterol"
                                            value={formData.cholesterol || ""}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.1"
                                            placeholder="200"
                                            className="h-10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Catatan Tambahan
                                        </label>
                                        <Textarea
                                            name="notes"
                                            value={formData.notes || ""}
                                            onChange={handleChange}
                                            placeholder="Tulis catatan tentang kesehatan Anda..."
                                            className="h-24"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !token}
                                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {!token ? (
                                            <>
                                                <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                Memuat...
                                            </>
                                        ) : isLoading ? (
                                            <>
                                                <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <TrendingUp className="w-4 h-4 mr-2" />
                                                Hitung BMI & Simpan Data
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Box */}
                    <div>
                        <Card className="border-0 shadow-lg bg-linear-to-br from-blue-50 to-indigo-50">
                            <CardHeader>
                                <CardTitle className="text-lg">Informasi BMI</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Kurang: &lt;18.5</p>
                                            <p className="text-gray-600 text-xs">Berat badan kurang</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 shrink-0"></div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Normal: 18.5-24.9</p>
                                            <p className="text-gray-600 text-xs">Berat badan ideal</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5 shrink-0"></div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Berlebih: 25-29.9</p>
                                            <p className="text-gray-600 text-xs">Berat badan berlebih</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 shrink-0"></div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Obese: ≥30</p>
                                            <p className="text-gray-600 text-xs">Obesitas</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Result */}
                {result && (
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-600 mb-2">Tinggi Badan</p>
                                <p className="text-3xl font-bold text-gray-900">{result.height}</p>
                                <p className="text-xs text-gray-500 mt-1">cm</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-600 mb-2">Berat Badan</p>
                                <p className="text-3xl font-bold text-gray-900">{result.weight}</p>
                                <p className="text-xs text-gray-500 mt-1">kg</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-linear-to-br from-blue-50 to-indigo-50">
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-600 mb-2">BMI Anda</p>
                                <p className="text-3xl font-bold text-blue-600">{result.bmi}</p>
                                <p className="text-xs text-gray-500 mt-1">Body Mass Index</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {result && (
                    <Card className={`border-2 shadow-lg mt-6 ${getStatusBg(result.status)}`}>
                        <CardContent className="p-8 text-center">
                            <p className="text-sm text-gray-600 mb-3 font-medium">Status Kesehatan Anda</p>
                            <p className={`text-4xl font-bold ${getStatusColor(result.status)} mb-4`}>
                                {getStatusText(result.status)}
                            </p>
                            <p className="text-gray-600 text-sm max-w-md mx-auto">
                                Berdasarkan hasil perhitungan BMI, status kesehatan Anda menunjukkan kategori tersebut. Untuk informasi lebih detail, konsultasikan dengan profesional kesehatan.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
