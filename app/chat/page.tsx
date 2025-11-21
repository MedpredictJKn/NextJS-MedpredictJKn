"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Send, MessageCircle, ArrowLeft, Loader, User, Bot } from "lucide-react";

interface Message {
    type: "user" | "bot";
    text: string;
    timestamp: Date;
}

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/auth/login");
            return;
        }
        setIsCheckingAuth(false);
    }, [router]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Token tidak ditemukan, silahkan login ulang");
            router.push("/auth/login");
            return;
        }

        const messageText = inputValue;

        const userMessage: Message = {
            type: "user",
            text: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: messageText,
                    source: "gemini",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Gagal mengirim pesan");
                return;
            }

            const botMessage: Message = {
                type: "bot",
                text: data.data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            setError(String(err) || "Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50">
                <div className="text-center space-y-4">
                    <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                    <p className="text-gray-600 font-medium">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex flex-col">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-linear-to-br from-purple-600 to-blue-600 p-2 rounded-full">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Chat dengan AI</h1>
                            <p className="text-xs text-gray-600">Tanyakan pertanyaan kesehatan Anda</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
                {/* Empty State */}
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center mb-8">
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="bg-linear-to-br from-purple-100 to-blue-100 p-6 rounded-full">
                                    <MessageCircle className="w-12 h-12 text-purple-600" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Mulai Percakapan
                                </h2>
                                <p className="text-gray-600 max-w-md">
                                    Tanyakan apa pun tentang kesehatan Anda. AI kami siap membantu menjawab pertanyaan dengan informasi yang akurat.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Button variant="outline" size="sm" className="text-xs">
                                    Obat-obatan
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs">
                                    Gaya Hidup
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs">
                                    Nutrisi
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs">
                                    Kesehatan Mental
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {messages.length > 0 && (
                    <div className="flex-1 space-y-4 mb-8 overflow-y-auto pr-2">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                            >
                                <div className={`flex gap-3 max-w-2xl ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.type === "user"
                                        ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white"
                                        : "bg-linear-to-br from-purple-600 to-blue-600 text-white"
                                        }`}>
                                        {message.type === "user" ? (
                                            <User className="w-4 h-4" />
                                        ) : (
                                            <Bot className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div>
                                        <Card className={`border-0 ${message.type === "user"
                                            ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md"
                                            : "bg-white text-gray-900 shadow-md"
                                            }`}>
                                            <CardContent className="p-4">
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                    {message.text}
                                                </p>
                                                <p className={`text-xs mt-3 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                                                    {message.timestamp.toLocaleTimeString("id-ID", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-purple-600 to-blue-600 text-white">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <Card className="border-0 bg-white text-gray-900 shadow-md">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Loader className="w-4 h-4 animate-spin text-purple-600" />
                                                <span className="text-sm text-gray-600">AI sedang berpikir...</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex gap-3 sticky bottom-0 bg-linear-to-t from-white to-transparent pt-4">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ketik pesan Anda..."
                        disabled={isLoading}
                        className="h-11 flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="h-11 px-6 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                        {isLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </form>

                {/* Footer Info */}
                <div className="text-center text-sm text-gray-600 mt-4">
                    <p>Informasi dari AI mungkin tidak 100% akurat. Konsultasikan dengan dokter untuk diagnosis medis.</p>
                </div>
            </main>
        </div>
    );
}
