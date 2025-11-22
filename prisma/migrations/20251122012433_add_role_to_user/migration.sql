-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'patient';

-- CreateTable
CREATE TABLE "doctor_messages" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sentViaWA" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctor_messages" ADD CONSTRAINT "doctor_messages_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
