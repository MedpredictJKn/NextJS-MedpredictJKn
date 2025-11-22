"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            return;
        }

        let isMounted = true;

        const verifyEmail = async () => {
            try {
                const response = await fetch(`/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (isMounted) {
                    if (data.success) {
                        setStatus("success");
                        setMessage(data.message);
                        setTimeout(() => router.push("/auth/login"), 3000);
                    } else {
                        setStatus("error");
                        setMessage(data.message);
                    }
                }
            } catch (error) {
                console.error("Verification error:", error);
                if (isMounted) {
                    setStatus("error");
                    setMessage("Terjadi kesalahan saat verifikasi email");
                }
            }
        };

        verifyEmail();

        return () => {
            isMounted = false;
        };
    }, [token, router]);

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

                            <div className="relative z-10 text-center space-y-6">
                                {/* Icon */}
                                {status === "loading" && (
                                    <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
                                )}
                                {status === "success" && (
                                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                                )}
                                {status === "error" && (
                                    <XCircle className="w-12 h-12 text-red-400 mx-auto" />
                                )}

                                {/* Title & Message */}
                                <div className="space-y-3">
                                    <h1 className="text-2xl font-bold text-white">
                                        {status === "loading" && "Memverifikasi Email..."}
                                        {status === "success" && "Email Terverifikasi!"}
                                        {status === "error" && "Verifikasi Gagal"}
                                    </h1>
                                    <p className="text-gray-300 text-sm">{message}</p>
                                </div>

                                {/* Actions */}
                                {status !== "loading" && (
                                    <div className="space-y-2 pt-4">
                                        <Link
                                            href="/auth/login"
                                            className="block w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                                        >
                                            Kembali ke Login
                                        </Link>
                                        {status === "error" && (
                                            <Link
                                                href="/auth/register"
                                                className="block w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all duration-200 border border-white/20"
                                            >
                                                Daftar Ulang
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
