import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

router.delete('/lesson/:id', async (req, res) => {
  const lessonId = parseInt(req.params.id);

  try {
    await prisma.leccionVideos.deleteMany({ where: { lec_id: lessonId } });
    await prisma.leccionArchivos.deleteMany({ where: { lec_id: lessonId } });
    await prisma.lecciones.delete({ where: { lec_id: lessonId } });

    res.status(200).json({ message: 'Lección eliminada' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Error deleting lesson' });
  }
});

router.delete('/quiz/:id', async (req, res) => {
  const quizId = parseInt(req.params.id);

  try {
    const preguntas = await prisma.quizPreguntas.findMany({ where: { quiz_id: quizId } });

    for (const pregunta of preguntas) {
      await prisma.quizRespuestas.deleteMany({ where: { pregunta_id: pregunta.pregunta_id } });
    }

    await prisma.quizPreguntas.deleteMany({ where: { quiz_id: quizId } });
    await prisma.quizzes.delete({ where: { quiz_id: quizId } });

    res.status(200).json({ message: 'Cuestionario eliminado' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Error deleting quiz' });
  }
});

router.delete('/module/:id', async (req, res) => {
  const moduleId = parseInt(req.params.id);

  try {
    const contenidos = await prisma.contenidoModulo.findMany({ where: { mod_id: moduleId } });

    for (const contenido of contenidos) {
      await prisma.progresoContenidoModulo.deleteMany({ where: { contenido_id: contenido.id } });

      if (contenido.tipo === 'Leccion' && contenido.lec_id) {
        await prisma.leccionVideos.deleteMany({ where: { lec_id: contenido.lec_id } });
        await prisma.leccionArchivos.deleteMany({ where: { lec_id: contenido.lec_id } });
        await prisma.lecciones.delete({ where: { lec_id: contenido.lec_id } });
      }

      if (contenido.tipo === 'Cuestionario' && contenido.quiz_id) {
        const preguntas = await prisma.quizPreguntas.findMany({ where: { quiz_id: contenido.quiz_id } });

        for (const pregunta of preguntas) {
          await prisma.quizRespuestas.deleteMany({ where: { pregunta_id: pregunta.pregunta_id } });
        }

        await prisma.quizPreguntas.deleteMany({ where: { quiz_id: contenido.quiz_id } });
        await prisma.quizzes.delete({ where: { quiz_id: contenido.quiz_id } });
      }

      await prisma.contenidoModulo.delete({ where: { id: contenido.id } });
    }

    await prisma.modulos.delete({ where: { mod_id: moduleId } });

    res.status(200).json({ message: 'Módulo eliminado' });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: 'Error deleting module' });
  }
});


router.delete('/course/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);

  try {
    const modulos = await prisma.modulos.findMany({ where: { curso_id: courseId } });

    for (const modulo of modulos) {
      await prisma.$executeRawUnsafe(`DELETE FROM "ContenidoModulo" WHERE "mod_id" = ${modulo.mod_id}`);
      await prisma.modulos.delete({ where: { mod_id: modulo.mod_id } });
    }

    await prisma.constancias.deleteMany({ where: { curso_id: courseId } });

    await prisma.cursos.delete({ where: { curs_id: courseId } });

    res.status(200).json({ message: 'Curso eliminado' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
});


export default router;