import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/utils";
import { sendVerificationEmail } from "@/lib/email";
import { generateToken, getTokenExpiry } from "@/lib/token";
import { AuthPayload, ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: AuthPayload = await request.json();

    // Validation
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, password, dan nama harus diisi",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Generate verification token
    const verificationToken = generateToken();
    const verificationTokenExpiry = getTokenExpiry(24); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        phone: body.phone,
        role: "patient", // Default role for new registrations
        verificationToken,
        verificationTokenExpiry,
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails, but log it
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil. Silakan cek email Anda untuk verifikasi",
        data: {
          user,
          requiresVerification: true,
        },
      } as ApiResponse<{ user: typeof user; requiresVerification: boolean }>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat registrasi",
        error: String(error),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
