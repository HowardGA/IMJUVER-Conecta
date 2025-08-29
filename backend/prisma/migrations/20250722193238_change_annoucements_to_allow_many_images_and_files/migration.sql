/*
  Warnings:

  - You are about to drop the column `img_id` on the `Publicaciones` table. All the data in the column will be lost.
  - You are about to drop the column `recursos_id` on the `Publicaciones` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Publicaciones" DROP CONSTRAINT "Publicaciones_img_id_fkey";

-- DropForeignKey
ALTER TABLE "Publicaciones" DROP CONSTRAINT "Publicaciones_recursos_id_fkey";

-- AlterTable
ALTER TABLE "Publicaciones" DROP COLUMN "img_id",
DROP COLUMN "recursos_id";

-- CreateTable
CREATE TABLE "PublicacionImagen" (
    "publicacion_id" INTEGER NOT NULL,
    "imagen_id" INTEGER NOT NULL,

    CONSTRAINT "PublicacionImagen_pkey" PRIMARY KEY ("publicacion_id","imagen_id")
);

-- CreateTable
CREATE TABLE "PublicacionRecurso" (
    "publicacion_id" INTEGER NOT NULL,
    "recurso_id" INTEGER NOT NULL,

    CONSTRAINT "PublicacionRecurso_pkey" PRIMARY KEY ("publicacion_id","recurso_id")
);

-- AddForeignKey
ALTER TABLE "PublicacionImagen" ADD CONSTRAINT "PublicacionImagen_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "Publicaciones"("pub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicacionImagen" ADD CONSTRAINT "PublicacionImagen_imagen_id_fkey" FOREIGN KEY ("imagen_id") REFERENCES "Imagenes"("img_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicacionRecurso" ADD CONSTRAINT "PublicacionRecurso_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "Publicaciones"("pub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicacionRecurso" ADD CONSTRAINT "PublicacionRecurso_recurso_id_fkey" FOREIGN KEY ("recurso_id") REFERENCES "Recursos"("rec_id") ON DELETE RESTRICT ON UPDATE CASCADE;
