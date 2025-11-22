import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import { isTokenExpired } from "@/lib/token";
import { ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: { code: string; password: string; passwordConfirmation: string } = await request.json();

    if (!body.code || !body.password || !body.passwordConfirmation) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode dan password harus diisi",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (body.password !== body.passwordConfirmation) {
      return NextResponse.json(
        {
          success: false,
          message: "Password tidak cocok",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password minimal 6 karakter",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find user with this reset code
    const user = await prisma.user.findFirst({
      where: { resetCode: body.code },
      select: {
        id: true,
        email: true,
        resetCodeExpiry: true,
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

    if (isTokenExpired(user.resetCodeExpiry)) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode sudah kadaluarsa. Silakan minta kode reset password baru",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(body.password);

    // Update password and clear reset code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpiry: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password berhasil direset. Silakan login dengan password baru",
      } as ApiResponse<null>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat reset password",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
