-- DropForeignKey
ALTER TABLE "CVS" DROP CONSTRAINT "CVS_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "Constancias" DROP CONSTRAINT "Constancias_curso_id_fkey";

-- DropForeignKey
ALTER TABLE "Constancias" DROP CONSTRAINT "Constancias_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "ContenidoModulo" DROP CONSTRAINT "ContenidoModulo_lec_id_fkey";

-- DropForeignKey
ALTER TABLE "ContenidoModulo" DROP CONSTRAINT "ContenidoModulo_mod_id_fkey";

-- DropForeignKey
ALTER TABLE "ContenidoModulo" DROP CONSTRAINT "ContenidoModulo_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "Hilos_Foros" DROP CONSTRAINT "Hilos_Foros_autor_id_fkey";

-- DropForeignKey
ALTER TABLE "LeccionArchivos" DROP CONSTRAINT "LeccionArchivos_lec_id_fkey";

-- DropForeignKey
ALTER TABLE "LeccionVideos" DROP CONSTRAINT "LeccionVideos_lec_id_fkey";

-- DropForeignKey
ALTER TABLE "Modulos" DROP CONSTRAINT "Modulos_curso_id_fkey";

-- DropForeignKey
ALTER TABLE "ProgresoContenidoModulo" DROP CONSTRAINT "ProgresoContenidoModulo_usu_id_fkey";

-- DropForeignKey
ALTER TABLE "Propuestas" DROP CONSTRAINT "Propuestas_autor_id_fkey";

-- DropForeignKey
ALTER TABLE "Publicaciones" DROP CONSTRAINT "Publicaciones_autor_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizPreguntas" DROP CONSTRAINT "QuizPreguntas_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizRespuestas" DROP CONSTRAINT "QuizRespuestas_pregunta_id_fkey";

-- DropForeignKey
ALTER TABLE "Respuestas_Foros" DROP CONSTRAINT "Respuestas_Foros_autor_id_fkey";

-- AddForeignKey
ALTER TABLE "Modulos" ADD CONSTRAINT "Modulos_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Cursos"("curs_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeccionVideos" ADD CONSTRAINT "LeccionVideos_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeccionArchivos" ADD CONSTRAINT "LeccionArchivos_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoContenidoModulo" ADD CONSTRAINT "ProgresoContenidoModulo_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizPreguntas" ADD CONSTRAINT "QuizPreguntas_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quizzes"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizRespuestas" ADD CONSTRAINT "QuizRespuestas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "QuizPreguntas"("pregunta_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Constancias" ADD CONSTRAINT "Constancias_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Constancias" ADD CONSTRAINT "Constancias_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Cursos"("curs_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenidoModulo" ADD CONSTRAINT "ContenidoModulo_mod_id_fkey" FOREIGN KEY ("mod_id") REFERENCES "Modulos"("mod_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenidoModulo" ADD CONSTRAINT "ContenidoModulo_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenidoModulo" ADD CONSTRAINT "ContenidoModulo_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quizzes"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publicaciones" ADD CONSTRAINT "Publicaciones_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hilos_Foros" ADD CONSTRAINT "Hilos_Foros_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuestas_Foros" ADD CONSTRAINT "Respuestas_Foros_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propuestas" ADD CONSTRAINT "Propuestas_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CVS" ADD CONSTRAINT "CVS_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuarios"("usu_id") ON DELETE CASCADE ON UPDATE CASCADE;
