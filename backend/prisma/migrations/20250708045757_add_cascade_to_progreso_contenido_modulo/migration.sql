-- DropForeignKey
ALTER TABLE "ProgresoContenidoModulo" DROP CONSTRAINT "ProgresoContenidoModulo_contenido_id_fkey";

-- AddForeignKey
ALTER TABLE "ProgresoContenidoModulo" ADD CONSTRAINT "ProgresoContenidoModulo_contenido_id_fkey" FOREIGN KEY ("contenido_id") REFERENCES "ContenidoModulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
