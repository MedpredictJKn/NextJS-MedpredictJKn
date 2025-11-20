import { prisma } from "@/lib/db";
import { HealthCheckPayload, HealthData } from "@/types";
import { calculateBMI, getBMIStatus } from "@/lib/utils";

export async function createHealthData(
  userId: string,
  data: HealthCheckPayload
): Promise<HealthData> {
  // Convert string to number
  const height = parseFloat(String(data.height));
  const weight = parseFloat(String(data.weight));
  const bloodSugar = data.bloodSugar ? parseFloat(String(data.bloodSugar)) : null;
  const cholesterol = data.cholesterol ? parseFloat(String(data.cholesterol)) : null;

  // Validate numbers
  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Tinggi dan berat badan harus berupa angka");
  }

  if (height <= 0 || weight <= 0) {
    throw new Error("Tinggi dan berat badan harus lebih dari 0");
  }

  const bmi = calculateBMI(height, weight);
  const status = getBMIStatus(bmi);

  const healthData = await prisma.healthData.create({
    data: {
      userId,
      height,
      weight,
      bmi,
      status,
      bloodPressure: data.bloodPressure || null,
      bloodSugar,
      cholesterol,
      notes: data.notes || null,
    },
  });

  return healthData;
}

export async function getHealthHistory(userId: string) {
  return prisma.healthData.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function getLatestHealth(userId: string) {
  return prisma.healthData.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
