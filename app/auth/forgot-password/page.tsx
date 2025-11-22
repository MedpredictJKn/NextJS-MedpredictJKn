"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
            } else {
                setError(data.message || "Terjadi kesalahan");
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            setError("Terjadi kesalahan saat memproses permintaan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

            <div className="w-full max-w-7xl flex gap-8 relative z-10 h-screen md:h-auto md:max-h-screen md:items-center">
                {/* Left Side - Logo & Branding */}
                <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center space-y-8 pr-8">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <Image
                                src="/images/medpredictjkn.png"
                                alt="MedpredictJKn JKN Logo"
                                width={120}
                                height={120}
                                priority
                                className="drop-shadow-lg"
                            />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold">
                                <span style={{ color: "#123c70", textShadow: "0 2px 8px rgba(18, 60, 112, 0.5)" }}>Medpredict</span>
                                <span style={{ color: "#76c04a", textShadow: "0 2px 8px rgba(118, 192, 74, 0.5)" }}>JKn</span>
                            </h1>
                            <p className="text-lg text-gray-300 mt-4">Sistem Prediksi Risiko Kesehatan Berbasis AI</p>
                        </div>
                    </div>
                    <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                    <p className="text-center text-sm text-gray-400 max-w-sm">
                        Reset password Anda dengan aman melalui email yang terverifikasi
                    </p>
                </div>

                {/* Right Side - Forgot Password Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="w-full max-w-md space-y-6">
                        {/* Mobile Logo */}
                        <div className="md:hidden text-center space-y-3 mb-8">
                            <div className="flex justify-center mb-4">
                                <Image
                                    src="/images/medpredictjkn.png"
                                    alt="MedpredictJKn JKN Logo"
                                    width={80}
                                    height={80}
                                    priority
                                    className="drop-shadow-lg"
                                />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">
                                    <span style={{ color: "#123c70" }}>Medpredict</span>
                                    <span style={{ color: "#76c04a" }}>JKn</span>
                                </h1>
                                <p className="text-sm text-gray-400 mt-2">Sistem Prediksi Risiko Kesehatan Berbasis AI</p>
                            </div>
                        </div>

                        {/* Forgot Password Form Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="space-y-2 mb-8">
                                    <h2 className="text-2xl font-bold text-white">Lupa Password?</h2>
                                    <p className="text-gray-400 text-sm">Masukkan email Anda dan kami akan mengirimkan link untuk reset password</p>
                                </div>

                                {submitted ? (
                                    <div className="space-y-4 text-center py-8">
                                        <div className="flex justify-center">
                                            <div className="bg-green-500/20 p-3 rounded-full">
                                                <Mail className="w-8 h-8 text-green-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Email Terkirim</h3>
                                        <p className="text-gray-300 text-sm">
                                            Jika email Anda terdaftar di sistem kami, Anda akan menerima link reset password dalam beberapa menit.
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            Silakan cek email Anda termasuk folder spam. Link berlaku selama 1 jam.
                                        </p>
                                        <div className="space-y-2 pt-4">
                                            <Link
                                                href="/auth/login"
                                                className="block w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                                            >
                                                Kembali ke Login
                                            </Link>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="block w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all duration-200 border border-white/20"
                                            >
                                                Coba Email Lain
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {error && (
                                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/20 border border-red-500/40 mb-6 backdrop-blur">
                                                <Mail className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                                                <p className="text-red-300 text-sm">{error}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-purple-400" />
                                                    Email
                                                </label>
                                                <Input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="nama@example.com"
                                                    className="h-11 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-lg focus:border-purple-400 focus:ring-purple-400/20"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-11 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        Mengirim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail className="w-4 h-4" />
                                                        Kirim Link Reset
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        <div className="text-center text-sm mt-6 pt-6 border-t border-white/10">
                                            <span className="text-gray-400">Ingat password? </span>
                                            <Link
                                                href="/auth/login"
                                                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                                            >
                                                Masuk di sini
                                            </Link>
                                        </div>

                                        <div className="text-center text-sm">
                                            <span className="text-gray-400">Belum punya akun? </span>
                                            <Link
                                                href="/auth/register"
                                                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                                            >
                                                Daftar di sini
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Mobile Footer Info */}
                        <p className="md:hidden text-center text-xs text-gray-500">
                            Data Anda dilindungi dengan enkripsi tingkat enterprise
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
