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
                        // Redirect to login after 3 seconds
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
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-0"></div>

            {/* Content */}
            <div className="relative z-10 max-w-md w-full">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center space-y-6">
                    {/* Icon */}
                    {status === "loading" && (
                        <div className="flex justify-center">
                            <Loader className="w-12 h-12 text-blue-400 animate-spin" />
                        </div>
                    )}
                    {status === "success" && (
                        <div className="flex justify-center">
                            <CheckCircle className="w-12 h-12 text-green-400" />
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex justify-center">
                            <XCircle className="w-12 h-12 text-red-400" />
                        </div>
                    )}

                    {/* Message */}
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {status === "loading" && "Memverifikasi Email..."}
                            {status === "success" && "Email Terverifikasi!"}
                            {status === "error" && "Verifikasi Gagal"}
                        </h1>
                        <p className="text-gray-300">{message}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 pt-4">
                        <Link
                            href="/auth/login"
                            className="block w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                        >
                            Kembali ke Login
                        </Link>
                        <Link
                            href="/auth/register"
                            className="block w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all duration-200 border border-white/20"
                        >
                            Daftar Akun Baru
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Butuh bantuan? <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">Hubungi kami</Link>
                </p>
            </div>
        </div>
    );
}
