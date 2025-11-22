import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isTokenExpired } from "@/lib/token";
import { ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token tidak ditemukan",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        verificationTokenExpiry: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Token tidak valid",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (isTokenExpired(user.verificationTokenExpiry)) {
      return NextResponse.json(
        {
          success: false,
          message: "Token sudah kadaluarsa. Silakan daftar ulang atau minta email verifikasi baru",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terverifikasi sebelumnya",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Mark email as verified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email berhasil diverifikasi. Anda sekarang dapat login",
      } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat verifikasi email",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
