-- DropForeignKey
ALTER TABLE "PublicacionImagen" DROP CONSTRAINT "PublicacionImagen_publicacion_id_fkey";

-- DropForeignKey
ALTER TABLE "PublicacionRecurso" DROP CONSTRAINT "PublicacionRecurso_publicacion_id_fkey";

-- AddForeignKey
ALTER TABLE "PublicacionImagen" ADD CONSTRAINT "PublicacionImagen_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "Publicaciones"("pub_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicacionRecurso" ADD CONSTRAINT "PublicacionRecurso_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "Publicaciones"("pub_id") ON DELETE CASCADE ON UPDATE CASCADE;
