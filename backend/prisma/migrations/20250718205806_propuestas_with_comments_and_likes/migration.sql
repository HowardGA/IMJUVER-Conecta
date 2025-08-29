/*
  Warnings:

  - You are about to drop the `Categorias_Foros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hilos_Foros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Propuestas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Respuestas_Foros` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hilos_Foros" DROP CONSTRAINT "Hilos_Foros_autor_id_fkey";

-- DropForeignKey
ALTER TABLE "Hilos_Foros" DROP CONSTRAINT "Hilos_Foros_cat_for_id_fkey";

-- DropForeignKey
ALTER TABLE "Propuestas" DROP CONSTRAINT "Propuestas_autor_id_fkey";

-- DropForeignKey
ALTER TABLE "Respuestas_Foros" DROP CONSTRAINT "Respuestas_Foros_autor_id_fkey";

-- DropForeignKey
ALTER TABLE "Respuestas_Foros" DROP CONSTRAINT "Respuestas_Foros_hilo_id_fkey";

-- DropTable
DROP TABLE "Categorias_Foros";

-- DropTable
DROP TABLE "Hilos_Foros";

-- DropTable
DROP TABLE "Propuestas";

-- DropTable
DROP TABLE "Respuestas_Foros";

-- CreateTable
CREATE TABLE "Idea" (
    "idea_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autor_id" INTEGER NOT NULL,
    "estado" "EstadoPropuesta" NOT NULL DEFAULT 'Recibida',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("idea_id")
);

-- CreateTable
CREATE TABLE "LikeIdea" (
    "like_id" SERIAL NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LikeIdea_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "ComentarioIdea" (
    "comentario_id" SERIAL NOT NULL,
    "contenido" VARCHAR(500) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idea_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ComentarioIdea_pkey" PRIMARY KEY ("comentario_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LikeIdea_idea_id_usuario_id_key" ON "LikeIdea"("idea_id", "usuario_id");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeIdea" ADD CONSTRAINT "LikeIdea_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "Idea"("idea_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeIdea" ADD CONSTRAINT "LikeIdea_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioIdea" ADD CONSTRAINT "ComentarioIdea_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "Idea"("idea_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComentarioIdea" ADD CONSTRAINT "ComentarioIdea_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;
