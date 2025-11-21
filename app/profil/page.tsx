"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
}

export default function ProfilPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/auth/login");
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            if (userData.profilePhoto) {
                setPhotoPreview(userData.profilePhoto);
            }
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setPhotoPreview(result);
                const updatedUser: User = { ...user, profilePhoto: result };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
                <div className="text-center space-y-4">
                    <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="text-gray-600 font-medium">Memuat profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar onLogout={handleLogout} userName={user?.name} userEmail={user?.email} />

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                            <ArrowLeft className="w-5 h-5" />
                            Kembali ke Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-600">{user?.email}</p>
                            </div>
                            <div className="h-10 w-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Profile Content */}
                <div className="p-8">
                    <div className="max-w-2xl mx-auto">
                        {/* Profile Card */}
                        <Card className="border-0 shadow-md">
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-2xl">Profil Anda</CardTitle>
                                <CardDescription>Kelola informasi profil dan foto Anda</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {/* Profile Photo Section */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative">
                                        {photoPreview ? (
                                            <Image
                                                src={photoPreview}
                                                alt={user?.name || "Profile"}
                                                width={120}
                                                height={120}
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-4xl">
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer transition-all shadow-sm hover:shadow-md">
                                            <Camera className="w-5 h-5" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-sm text-gray-600 text-center">Klik ikon kamera untuk mengubah foto profil</p>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Profile Information */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Nama Lengkap</label>
                                        <p className="text-gray-900 font-semibold mt-2 text-lg">{user?.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Email</label>
                                        <p className="text-gray-900 font-semibold mt-2 text-lg">{user?.email}</p>
                                    </div>

                                    {user?.phone && (
                                        <div>
                                            <label className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Telepon</label>
                                            <p className="text-gray-900 font-semibold mt-2 text-lg">{user.phone}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200"></div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => router.push("/dashboard")}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    >
                                        Kembali
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Status Card */}
                        <Card className="border-0 shadow-md bg-linear-to-br from-green-50 to-emerald-50 mt-6">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Status Akun</p>
                                        <p className="text-2xl font-bold text-green-600 mt-2">Aktif</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                        <p className="text-xs text-green-600 font-medium">Terverifikasi</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
