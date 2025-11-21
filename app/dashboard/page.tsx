"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, MessageCircle, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/auth/login");
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

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
                    <p className="text-gray-600 font-medium">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    const quickStats = [
        { label: "Total Pemeriksaan", value: "5", icon: Activity, color: "from-blue-600 to-indigo-600" },
        { label: "Chat AI", value: "12", icon: MessageCircle, color: "from-purple-600 to-pink-600" },
        { label: "Alert Aktif", value: "2", icon: AlertCircle, color: "from-orange-600 to-red-600" },
        { label: "Notifikasi", value: "8", icon: TrendingUp, color: "from-green-600 to-emerald-600" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar onLogout={handleLogout} userName={user?.name} userEmail={user?.email} />

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Top Bar - Navbar */}
                <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-xs text-gray-600 mt-1">Selamat datang kembali, <span className="font-semibold text-gray-700">{user?.name}</span></p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {quickStats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`bg-linear-to-br ${stat.color} p-3 rounded-lg shadow-sm`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                                Aktif
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Main Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Services */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                <CardHeader className="border-b border-gray-100 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <BarChart3 className="w-5 h-5 text-blue-600" />
                                        Layanan Utama
                                    </CardTitle>
                                    <CardDescription className="text-sm">Akses fitur aplikasi <span style={{ color: "#123c70" }}>Medpredict</span><span style={{ color: "#76c04a" }}>JKn</span></CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Service 1 */}
                                        <div className="p-4 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                    <Activity className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Cek Kesehatan</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Periksa BMI, tekanan darah, dan data kesehatan Anda
                                            </p>
                                            <a href="/cek-kesehatan" className="text-blue-600 text-sm font-semibold hover:text-blue-700 inline-flex items-center gap-1">
                                                Mulai Pemeriksaan <span>→</span>
                                            </a>
                                        </div>

                                        {/* Service 2 */}
                                        <div className="p-4 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                    <MessageCircle className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">Chat dengan AI</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Tanyakan pertanyaan kesehatan kepada AI kami
                                            </p>
                                            <a href="/chat" className="text-purple-600 text-sm font-semibold hover:text-purple-700 inline-flex items-center gap-1">
                                                Mulai Chat <span>→</span>
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Account Info */}
                        <div className="space-y-6">
                            {/* Quick Access */}
                            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                <CardHeader className="border-b border-gray-100 pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Akses Cepat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    <Link href="/cek-kesehatan" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group cursor-pointer">
                                        <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <Activity className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">Cek Kesehatan</p>
                                            <p className="text-xs text-gray-500">Periksa data kesehatan</p>
                                        </div>
                                    </Link>
                                    <Link href="/chat" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group cursor-pointer">
                                        <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                                            <MessageCircle className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">Chat AI</p>
                                            <p className="text-xs text-gray-500">Tanya jawab kesehatan</p>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Activity Section */}
                    <div className="mt-8">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    Aktivitas Terbaru
                                </CardTitle>
                                <CardDescription>Riwayat aktivitas Anda minggu ini</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {[
                                        { title: "Pemeriksaan Kesehatan", time: "2 hari lalu", status: "Selesai" },
                                        { title: "Chat dengan AI", time: "1 minggu lalu", status: "Aktif" },
                                        { title: "Update Profil", time: "2 minggu lalu", status: "Selesai" },
                                    ].map((activity, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${activity.status === "Selesai"
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "bg-blue-100 text-blue-700 border border-blue-200"
                                                }`}>
                                                {activity.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
