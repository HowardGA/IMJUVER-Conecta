/*
  Warnings:

  - You are about to drop the column `mod_id` on the `Lecciones` table. All the data in the column will be lost.
  - You are about to drop the column `orden` on the `Lecciones` table. All the data in the column will be lost.
  - You are about to drop the column `pregunta` on the `QuizPreguntas` table. All the data in the column will be lost.
  - You are about to drop the column `texto` on the `QuizRespuestas` table. All the data in the column will be lost.
  - You are about to drop the column `lec_id` on the `Quizzes` table. All the data in the column will be lost.
  - Added the required column `texto_pregunta` to the `QuizPreguntas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_pregunta` to the `QuizPreguntas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `texto_respuesta` to the `QuizRespuestas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoPregunta" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE');

-- DropForeignKey
ALTER TABLE "Lecciones" DROP CONSTRAINT "Lecciones_mod_id_fkey";

-- DropForeignKey
ALTER TABLE "Quizzes" DROP CONSTRAINT "Quizzes_lec_id_fkey";

-- AlterTable
ALTER TABLE "Lecciones" DROP COLUMN "mod_id",
DROP COLUMN "orden";

-- AlterTable
ALTER TABLE "QuizPreguntas" DROP COLUMN "pregunta",
ADD COLUMN     "texto_pregunta" VARCHAR(500) NOT NULL,
ADD COLUMN     "tipo_pregunta" "TipoPregunta" NOT NULL;

-- AlterTable
ALTER TABLE "QuizRespuestas" DROP COLUMN "texto",
ADD COLUMN     "texto_respuesta" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Quizzes" DROP COLUMN "lec_id";

-- CreateTable
CREATE TABLE "ContenidoModulo" (
    "id" SERIAL NOT NULL,
    "mod_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "lec_id" INTEGER,
    "quiz_id" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContenidoModulo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContenidoModulo_lec_id_key" ON "ContenidoModulo"("lec_id");

-- CreateIndex
CREATE UNIQUE INDEX "ContenidoModulo_quiz_id_key" ON "ContenidoModulo"("quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "ContenidoModulo_mod_id_orden_key" ON "ContenidoModulo"("mod_id", "orden");

-- AddForeignKey
ALTER TABLE "ContenidoModulo" ADD CONSTRAINT "ContenidoModulo_mod_id_fkey" FOREIGN KEY ("mod_id") REFERENCES "Modulos"("mod_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenidoModulo" ADD CONSTRAINT "ContenidoModulo_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenidoModulo" ADD CONSTRAINT "ContenidoModulo_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quizzes"("quiz_id") ON DELETE SET NULL ON UPDATE CASCADE;
