"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader } from "lucide-react";

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
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* Content */}
            <div className="relative z-10 max-w-md w-full">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Login
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="bg-linear-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-white text-center mb-2">Lupa Password?</h1>
                        <p className="text-gray-400 text-center text-sm">
                            Masukkan email Anda dan kami akan mengirimkan link untuk reset password
                        </p>
                    </div>

                    {submitted ? (
                        // Success Message
                        <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4">
                            <p className="text-green-300 text-sm text-center">
                                Jika email terdaftar di sistem kami, Anda akan menerima link reset password dalam beberapa menit. Silakan cek email Anda termasuk folder spam.
                            </p>
                        </div>
                    ) : (
                        // Form
                        <>
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nama@email.com"
                                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        "Kirim Link Reset"
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-900 text-gray-400">atau</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-2 text-center">
                                <p className="text-sm text-gray-400">
                                    Ingat password Anda?{" "}
                                    <Link
                                        href="/auth/login"
                                        className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                                    >
                                        Login di sini
                                    </Link>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Belum punya akun?{" "}
                                    <Link
                                        href="/auth/register"
                                        className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                                    >
                                        Daftar sekarang
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}

                    {/* Additional Note */}
                    {submitted && (
                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                            >
                                Kembali ke Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Butuh bantuan lainnya? <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">Hubungi kami</Link>
                </p>
            </div>
        </div>
    );
}
