/*
  Warnings:

  - Added the required column `contenido` to the `Lecciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecciones" DROP COLUMN "contenido",
ADD COLUMN     "contenido" JSONB NOT NULL;
