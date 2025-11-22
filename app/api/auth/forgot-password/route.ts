import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetCodeEmail } from "@/lib/email";
import { generateResetCode, getTokenExpiry } from "@/lib/token";
import { ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: { email: string } = await request.json();

    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email harus diisi",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, email: true, name: true },
    });

    // Always return success message for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "Jika email terdaftar, Anda akan menerima kode reset password dalam beberapa menit",
        } as ApiResponse<null>,
        { status: 200 }
      );
    }

    // Generate 6-digit reset code
    const resetCode = generateResetCode();
    const resetCodeExpiry = getTokenExpiry(0.167); // 10 minutes

    // Update user with reset code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode,
        resetCodeExpiry,
      },
    });

    // Send password reset code email
    try {
      await sendPasswordResetCodeEmail(user.email, resetCode);
    } catch (emailError) {
      console.error("Failed to send password reset code email:", emailError);
      // Continue anyway - code is still stored in DB
    }

    return NextResponse.json(
      {
        success: true,
        message: "Jika email terdaftar, Anda akan menerima kode reset password dalam beberapa menit",
      } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses permintaan",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
