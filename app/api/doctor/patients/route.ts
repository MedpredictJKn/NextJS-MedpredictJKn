import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, extractToken } from "@/lib/utils";
import { ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PatientWithHealth {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  gender: string | null;
  latestHealth: {
    id: string;
    height: number;
    weight: number;
    bmi: number;
    status: string;
    bloodPressure: string | null;
    bloodSugar: number | null;
    cholesterol: number | null;
    notes: string | null;
    createdAt: Date;
  } | null;
  healthHistory: {
    id: string;
    height: number;
    weight: number;
    bmi: number;
    status: string;
    bloodPressure: string | null;
    bloodSugar: number | null;
    cholesterol: number | null;
    notes: string | null;
    createdAt: Date;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    // Verify token
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token tidak ditemukan" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Token tidak valid" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Check if user is doctor
    const doctor = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!doctor || doctor.role !== "doctor") {
      return NextResponse.json(
        { success: false, message: "Anda bukan dokter" } as ApiResponse<null>,
        { status: 403 }
      );
    }

    // Get all patients with latest health data and history
    const patients = await prisma.user.findMany({
      where: { role: "patient" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        gender: true,
        healthData: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            height: true,
            weight: true,
            bmi: true,
            status: true,
            bloodPressure: true,
            bloodSugar: true,
            cholesterol: true,
            notes: true,
            createdAt: true,
          },
        },
      },
    });

    // Transform data
    const transformedPatients: PatientWithHealth[] = patients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      latestHealth: patient.healthData[0] || null,
      healthHistory: patient.healthData || [],
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Data pasien berhasil diambil",
        data: transformedPatients,
      } as ApiResponse<PatientWithHealth[]>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Get patients error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data pasien",
        error: String(error),
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
