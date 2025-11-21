"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, UserPlus, Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registrasi gagal");
                return;
            }

            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));

            router.push("/dashboard");
        } catch (err) {
            setError(String(err) || "Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo Section */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/images/medpredictjkn.png"
                            alt="MedPredict Logo"
                            width={60}
                            height={60}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">
                            <span style={{ color: "#123c70" }}>Medpredict</span><span style={{ color: "#76c04a" }}>JKn</span>
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Buat Akun Baru</p>
                    </div>
                </div>

                {/* Register Form Card */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle>Daftar Akun</CardTitle>
                        <CardDescription>
                            Isi data di bawah untuk membuat akun baru
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Nama Lengkap
                                </label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="nama@example.com"
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Nomor Telepon
                                </label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+62812345678"
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="h-10"
                                />
                                <p className="text-xs text-gray-600">
                                    Minimal 8 karakter untuk keamanan
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Daftar
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="text-center text-sm">
                            <span className="text-gray-600">Sudah punya akun? </span>
                            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Masuk di sini
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <p className="text-center text-xs text-gray-600">
                    Data Anda dilindungi dengan enkripsi tingkat enterprise
                </p>
            </div>
        </div>
    );
}
