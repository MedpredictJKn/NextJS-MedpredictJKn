import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isTokenExpired } from "@/lib/token";
import { ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: { code: string } = await request.json();

    if (!body.code) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode harus diisi",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find user by reset code
    const user = await prisma.user.findFirst({
      where: { resetCode: body.code },
      select: { 
        id: true, 
        email: true, 
        resetCode: true,
        resetCodeExpiry: true 
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode tidak valid",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if code has expired
    if (isTokenExpired(user.resetCodeExpiry)) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode sudah kadaluarsa. Silakan minta kode baru",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Kode valid",
        data: { userId: user.id, email: user.email },
      } as ApiResponse<{ userId: string; email: string }>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify reset code error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses permintaan",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
