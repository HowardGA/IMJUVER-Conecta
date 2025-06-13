-- CreateTable
CREATE TABLE "LeccionVideos" (
    "id" SERIAL NOT NULL,
    "lec_id" INTEGER NOT NULL,
    "video_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "LeccionVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeccionArchivos" (
    "id" SERIAL NOT NULL,
    "lec_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,

    CONSTRAINT "LeccionArchivos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeccionVideos" ADD CONSTRAINT "LeccionVideos_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeccionArchivos" ADD CONSTRAINT "LeccionArchivos_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE RESTRICT ON UPDATE CASCADE;
