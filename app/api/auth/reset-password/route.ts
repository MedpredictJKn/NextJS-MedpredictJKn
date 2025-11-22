import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import { isTokenExpired } from "@/lib/token";
import { ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: { token: string; password: string; passwordConfirmation: string } = await request.json();

    if (!body.token || !body.password || !body.passwordConfirmation) {
      return NextResponse.json(
        {
          success: false,
          message: "Token dan password harus diisi",
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

    // Find user with this reset token
    const user = await prisma.user.findUnique({
      where: { resetToken: body.token },
      select: {
        id: true,
        email: true,
        resetTokenExpiry: true,
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

    if (isTokenExpired(user.resetTokenExpiry)) {
      return NextResponse.json(
        {
          success: false,
          message: "Token sudah kadaluarsa. Silakan minta link reset password baru",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(body.password);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
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
