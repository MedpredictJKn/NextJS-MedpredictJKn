"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const tokenValid = !!code;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Password tidak cocok");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    password,
                    passwordConfirmation,
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/auth/login?resetSuccess=true");
            } else {
                setError(data.message || "Terjadi kesalahan");
            }
        } catch (err) {
            console.error("Reset password error:", err);
            setError("Terjadi kesalahan saat reset password");
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

                <div className="w-full max-w-7xl flex gap-8 relative z-10 h-auto md:h-screen md:max-h-screen md:items-center">
                    <div className="hidden md:w-1/2 md:flex"></div>
                    <div className="w-full md:w-1/2 flex items-center justify-center">
                        <div className="w-full max-w-md">
                            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 shadow-2xl h-auto md:h-[500px] flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
                                <div className="relative z-10 text-center space-y-6">
                                    <h1 className="text-2xl font-bold text-white">Link Tidak Valid</h1>
                                    <p className="text-gray-300">
                                        Kode reset password tidak ditemukan. Silakan minta kode baru.
                                    </p>
                                    <div className="space-y-2">
                                        <Link
                                            href="/auth/forgot-password"
                                            className="block w-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium py-2 rounded-lg transition-all duration-200"
                                        >
                                            Minta Kode Baru
                                        </Link>
                                        <Link
                                            href="/auth/login"
                                            className="block w-full bg-white/10 text-white font-medium py-2 rounded-lg transition-all duration-200 border border-white/20"
                                        >
                                            Kembali ke Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

            <div className="w-full max-w-7xl flex gap-8 relative z-10 h-auto md:h-screen md:max-h-screen md:items-center">
                <div className="hidden md:w-1/2 md:flex"></div>
                <div className="w-full md:w-1/2 flex items-center justify-center py-8 md:py-0">
                    <div className="w-full max-w-md">
                        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 shadow-2xl h-auto md:h-[500px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

                            <div className="relative z-10 space-y-6">
                                <div className="space-y-2 mb-6">
                                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                                    <p className="text-gray-400 text-sm">Masukkan password baru Anda</p>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 backdrop-blur">
                                        <p className="text-red-300 text-sm">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-purple-400" />
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Minimal 6 karakter"
                                                className="h-11 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-lg focus:border-purple-400 focus:ring-purple-400/20 pr-10"
                                                required
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-purple-400" />
                                            Konfirmasi Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPasswordConfirmation ? "text" : "password"}
                                                value={passwordConfirmation}
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                placeholder="Ulangi password"
                                                className="h-11 bg-white/5 border border-white/20 text-white placeholder:text-gray-500 rounded-lg focus:border-purple-400 focus:ring-purple-400/20 pr-10"
                                                required
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-11 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </button>
                                </form>

                                <div className="text-center text-sm pt-4 border-t border-white/10">
                                    <span className="text-gray-400">Ingat password? </span>
                                    <Link href="/auth/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                                        Masuk di sini
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
