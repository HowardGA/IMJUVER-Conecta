-- CreateEnum
CREATE TYPE "EstadoPropuesta" AS ENUM ('Recibida', 'EnRevision', 'Aprobada', 'Rechazada', 'Implementada');

-- CreateTable
CREATE TABLE "Roles" (
    "rol_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "usu_id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "apellido" VARCHAR(60) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "nivel_educativo" VARCHAR(100),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("usu_id")
);

-- CreateTable
CREATE TABLE "Categorias_Cursos" (
    "cat_cursos_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categorias_Cursos_pkey" PRIMARY KEY ("cat_cursos_id")
);

-- CreateTable
CREATE TABLE "Imagenes" (
    "img_id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imagenes_pkey" PRIMARY KEY ("img_id")
);

-- CreateTable
CREATE TABLE "Cursos" (
    "curs_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cat_cursos_id" INTEGER NOT NULL,
    "duracion" INTEGER NOT NULL,
    "nivel" VARCHAR(50),
    "portada_id" INTEGER,
    "constancia" BOOLEAN NOT NULL DEFAULT false,
    "publicado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Cursos_pkey" PRIMARY KEY ("curs_id")
);

-- CreateTable
CREATE TABLE "Modulos" (
    "mod_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "curso_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Modulos_pkey" PRIMARY KEY ("mod_id")
);

-- CreateTable
CREATE TABLE "Recursos" (
    "rec_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "Recursos_pkey" PRIMARY KEY ("rec_id")
);

-- CreateTable
CREATE TABLE "Lecciones" (
    "lec_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mod_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "contenido" TEXT,
    "recurso_id" INTEGER,

    CONSTRAINT "Lecciones_pkey" PRIMARY KEY ("lec_id")
);

-- CreateTable
CREATE TABLE "Progreso_Lecciones" (
    "prog_id" SERIAL NOT NULL,
    "lec_id" INTEGER NOT NULL,
    "usu_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progreso_Lecciones_pkey" PRIMARY KEY ("prog_id")
);

-- CreateTable
CREATE TABLE "Constancias" (
    "constancia_id" SERIAL NOT NULL,
    "usu_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Constancias_pkey" PRIMARY KEY ("constancia_id")
);

-- CreateTable
CREATE TABLE "Categorias_Publicaciones" (
    "cat_pub_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categorias_Publicaciones_pkey" PRIMARY KEY ("cat_pub_id")
);

-- CreateTable
CREATE TABLE "Publicaciones" (
    "pub_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cat_pub_id" INTEGER NOT NULL,
    "img_id" INTEGER,
    "recursos_id" INTEGER,
    "autor_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Publicaciones_pkey" PRIMARY KEY ("pub_id")
);

-- CreateTable
CREATE TABLE "Categorias_Foros" (
    "cat_for_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categorias_Foros_pkey" PRIMARY KEY ("cat_for_id")
);

-- CreateTable
CREATE TABLE "Hilos_Foros" (
    "hilo_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cat_for_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Hilos_Foros_pkey" PRIMARY KEY ("hilo_id")
);

-- CreateTable
CREATE TABLE "Respuestas_Foros" (
    "resp_id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hilo_id" INTEGER NOT NULL,
    "autor_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Respuestas_Foros_pkey" PRIMARY KEY ("resp_id")
);

-- CreateTable
CREATE TABLE "Propuestas" (
    "prop_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autor_id" INTEGER NOT NULL,
    "estado" "EstadoPropuesta" NOT NULL DEFAULT 'Recibida',

    CONSTRAINT "Propuestas_pkey" PRIMARY KEY ("prop_id")
);

-- CreateTable
CREATE TABLE "Eventos" (
    "eventos_id" SERIAL NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_evento" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fin" TIMESTAMP(3) NOT NULL,
    "lugar" VARCHAR(100) NOT NULL,
    "imagen_id" INTEGER,
    "requiere_registro" BOOLEAN NOT NULL DEFAULT false,
    "max_participantes" INTEGER,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("eventos_id")
);

-- CreateTable
CREATE TABLE "Categorias_Directorio" (
    "cat_dir_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categorias_Directorio_pkey" PRIMARY KEY ("cat_dir_id")
);

-- CreateTable
CREATE TABLE "Directorio" (
    "dir_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cat_dir_id" INTEGER NOT NULL,
    "url" VARCHAR(255),
    "telefono" VARCHAR(15) NOT NULL,
    "horarios" TEXT NOT NULL,

    CONSTRAINT "Directorio_pkey" PRIMARY KEY ("dir_id")
);

-- CreateTable
CREATE TABLE "Categorias_Ofertas" (
    "cat_of_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categorias_Ofertas_pkey" PRIMARY KEY ("cat_of_id")
);

-- CreateTable
CREATE TABLE "Ofertas" (
    "of_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cat_of_id" INTEGER NOT NULL,
    "url" VARCHAR(255),
    "fecha_vigencia" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ofertas_pkey" PRIMARY KEY ("of_id")
);

-- CreateTable
CREATE TABLE "CVS" (
    "cv_id" SERIAL NOT NULL,
    "usu_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "CVS_pkey" PRIMARY KEY ("cv_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Progreso_Lecciones_lec_id_usu_id_key" ON "Progreso_Lecciones"("lec_id", "usu_id");

-- CreateIndex
CREATE UNIQUE INDEX "Constancias_usu_id_curso_id_key" ON "Constancias"("usu_id", "curso_id");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Roles"("rol_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cursos" ADD CONSTRAINT "Cursos_cat_cursos_id_fkey" FOREIGN KEY ("cat_cursos_id") REFERENCES "Categorias_Cursos"("cat_cursos_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cursos" ADD CONSTRAINT "Cursos_portada_id_fkey" FOREIGN KEY ("portada_id") REFERENCES "Imagenes"("img_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modulos" ADD CONSTRAINT "Modulos_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Cursos"("curs_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecciones" ADD CONSTRAINT "Lecciones_mod_id_fkey" FOREIGN KEY ("mod_id") REFERENCES "Modulos"("mod_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecciones" ADD CONSTRAINT "Lecciones_recurso_id_fkey" FOREIGN KEY ("recurso_id") REFERENCES "Recursos"("rec_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progreso_Lecciones" ADD CONSTRAINT "Progreso_Lecciones_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progreso_Lecciones" ADD CONSTRAINT "Progreso_Lecciones_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Constancias" ADD CONSTRAINT "Constancias_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Constancias" ADD CONSTRAINT "Constancias_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Cursos"("curs_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publicaciones" ADD CONSTRAINT "Publicaciones_cat_pub_id_fkey" FOREIGN KEY ("cat_pub_id") REFERENCES "Categorias_Publicaciones"("cat_pub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publicaciones" ADD CONSTRAINT "Publicaciones_img_id_fkey" FOREIGN KEY ("img_id") REFERENCES "Imagenes"("img_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publicaciones" ADD CONSTRAINT "Publicaciones_recursos_id_fkey" FOREIGN KEY ("recursos_id") REFERENCES "Recursos"("rec_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publicaciones" ADD CONSTRAINT "Publicaciones_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hilos_Foros" ADD CONSTRAINT "Hilos_Foros_cat_for_id_fkey" FOREIGN KEY ("cat_for_id") REFERENCES "Categorias_Foros"("cat_for_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hilos_Foros" ADD CONSTRAINT "Hilos_Foros_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuestas_Foros" ADD CONSTRAINT "Respuestas_Foros_hilo_id_fkey" FOREIGN KEY ("hilo_id") REFERENCES "Hilos_Foros"("hilo_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuestas_Foros" ADD CONSTRAINT "Respuestas_Foros_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propuestas" ADD CONSTRAINT "Propuestas_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categorias_Publicaciones"("cat_pub_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_imagen_id_fkey" FOREIGN KEY ("imagen_id") REFERENCES "Imagenes"("img_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directorio" ADD CONSTRAINT "Directorio_cat_dir_id_fkey" FOREIGN KEY ("cat_dir_id") REFERENCES "Categorias_Directorio"("cat_dir_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ofertas" ADD CONSTRAINT "Ofertas_cat_of_id_fkey" FOREIGN KEY ("cat_of_id") REFERENCES "Categorias_Ofertas"("cat_of_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CVS" ADD CONSTRAINT "CVS_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "Usuarios"("usu_id") ON DELETE RESTRICT ON UPDATE CASCADE;
