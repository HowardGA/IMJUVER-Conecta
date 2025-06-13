-- CreateTable
CREATE TABLE "Quizzes" (
    "quiz_id" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(200),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lec_id" INTEGER NOT NULL,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "QuizPreguntas" (
    "pregunta_id" SERIAL NOT NULL,
    "pregunta" VARCHAR(255) NOT NULL,
    "quiz_id" INTEGER NOT NULL,

    CONSTRAINT "QuizPreguntas_pkey" PRIMARY KEY ("pregunta_id")
);

-- CreateTable
CREATE TABLE "QuizRespuestas" (
    "respuesta_id" SERIAL NOT NULL,
    "texto" VARCHAR(255) NOT NULL,
    "correcta" BOOLEAN NOT NULL DEFAULT false,
    "pregunta_id" INTEGER NOT NULL,

    CONSTRAINT "QuizRespuestas_pkey" PRIMARY KEY ("respuesta_id")
);

-- AddForeignKey
ALTER TABLE "Quizzes" ADD CONSTRAINT "Quizzes_lec_id_fkey" FOREIGN KEY ("lec_id") REFERENCES "Lecciones"("lec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizPreguntas" ADD CONSTRAINT "QuizPreguntas_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quizzes"("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizRespuestas" ADD CONSTRAINT "QuizRespuestas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "QuizPreguntas"("pregunta_id") ON DELETE RESTRICT ON UPDATE CASCADE;
