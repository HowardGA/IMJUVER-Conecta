/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_verificationToken_key" ON "Usuarios"("verificationToken");
