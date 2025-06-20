/*
  Warnings:

  - You are about to drop the `Progreso_Lecciones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Progreso_Lecciones" DROP CONSTRAINT "Progreso_Lecciones_lec_id_fkey";

-- DropForeignKey
ALTER TABLE "Progreso_Lecciones" DROP CONSTRAINT "Progreso_Lecciones_usu_id_fkey";

-- DropTable
DROP TABLE "Progreso_Lecciones";

-- CreateTable
CREATE TABLE "ProgresoContenidoModulo" (
    "prog_id" SERIAL NOT NULL,
    "usu_id" INTEGER NOT NULL,
    "contenido_id" INTEGER NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgresoContenidoModulo_pkey" PRIMARY KEY ("prog_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgresoContenidoModulo_usu_id_contenido_id_key" ON "ProgresoContenidoModulo"("usu_id", "contenido_id");

-- AddForeignKey
ALTER TABLE "ProgresoContenidoModulo" ADD CONSTRAINT "ProgresoContenidoModulo_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoContenidoModulo" ADD CONSTRAINT "ProgresoContenidoModulo_contenido_id_fkey" FOREIGN KEY ("contenido_id") REFERENCES "ContenidoModulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
