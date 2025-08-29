import express from 'express';
import prisma from '../prismaClient.js';
import { deletePhysicalFiles } from '../utils/fileDeletionUtils.js';

const router = express.Router();

// router.delete('/lesson/:id', async (req, res) => {
//   const lessonId = parseInt(req.params.id);

//   try {
//     await prisma.leccionVideos.deleteMany({ where: { lec_id: lessonId } });
//     await prisma.leccionArchivos.deleteMany({ where: { lec_id: lessonId } });
//     await prisma.lecciones.delete({ where: { lec_id: lessonId } });

//     res.status(200).json({ message: 'Lección eliminada' });
//   } catch (error) {
//     console.error('Error deleting lesson:', error);
//     res.status(500).json({ message: 'Error deleting lesson' });
//   }
// });
router.delete('/lesson/:id', async (req, res) => {
    const { id } = req.params;
    const lessonId = parseInt(id);
    if (isNaN(lessonId)) {
        return res.status(400).json({ message: 'ID de lección inválido.' });
    }
    try {
        const filesToDelete = await prisma.leccionArchivos.findMany({
            where: { lec_id: lessonId },
            select: { url: true }
        });
        if (filesToDelete.length > 0) {
            await Promise.all(
                filesToDelete.map(file => deleteFileFromDropbox(file.url))
            );
        }
        await prisma.$transaction(async (prismaTx) => {
            await prismaTx.leccionArchivos.deleteMany({
                where: { lec_id: lessonId },
            });
            await prismaTx.leccionVideos.deleteMany({
                where: { lec_id: lessonId },
            });
            await prismaTx.contenidoModulo.deleteMany({
                where: { lec_id: lessonId },
            });
            await prismaTx.lecciones.delete({
                where: { lec_id: lessonId },
            });
        });

        res.status(200).json({ message: 'Lección y archivos asociados eliminados con éxito.' });
    } catch (error) {
        console.error('Error al eliminar la lección:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Lección no encontrada.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al eliminar la lección.', error: error.message });
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


// router.delete('/course/:id', async (req, res) => {
//   const courseId = parseInt(req.params.id);
//   try {
//     const courseToDelete = await prisma.cursos.findUnique({
//       where: { curs_id: courseId },
//       select: {
//         portada_id: true,
//         portada: {
//           select: { url: true }
//         }
//       }
//     });
//     console.log(courseToDelete)
//     if (!courseToDelete) {
//       console.log("Curso no encontrado", courseId)
//       return res.status(404).json({ message: 'Curso no encontrado' });
//     }

//     const imageUrlToDelete = courseToDelete.portada?.url;
//     const imageIdToDelete = courseToDelete.portada_id;
//     const modulos = await prisma.modulos.findMany({ where: { curso_id: courseId } });
//     for (const modulo of modulos) {
//       await prisma.$executeRawUnsafe(`DELETE FROM "ContenidoModulo" WHERE "mod_id" = ${modulo.mod_id}`);
//       await prisma.modulos.delete({ where: { mod_id: modulo.mod_id } });
//     }
//     await prisma.constancias.deleteMany({ where: { curso_id: courseId } });
//     await prisma.cursos.delete({ where: { curs_id: courseId } });
//     if (imageIdToDelete) {
//       await prisma.imagenes.delete({ where: { img_id: imageIdToDelete } });
//     }
//         if (imageUrlToDelete) {
//       await deletePhysicalFiles(imageUrlToDelete);
//     }
//     res.status(200).json({ message: 'Curso eliminado exitosamente.' });
//   } catch (error) {
//     console.error('Error deleting course:', error);
//     res.status(500).json({ message: 'Error al eliminar el curso', error: error.message });
//   }
// });

router.delete('/course/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  try {
    const courseToDelete = await prisma.cursos.findUnique({
      where: { curs_id: courseId },
      select: {
        portada_id: true,
        portada: {
          select: { url: true }
        },
        modulos: {
            include: {
                contenido: {
                    include: {
                        leccion: {
                            include: {
                                leccionArchivos: true, 
                                leccionVideos: true, 
                            }
                        }
                    }
                }
            }
        }
      }
    });

    if (!courseToDelete) {
      console.log("Curso no encontrado", courseId);
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const imageUrlToDelete = courseToDelete.portada?.url;
    const imageIdToDelete = courseToDelete.portada_id;
    const filesToDeleteFromDropbox = [];
    if (imageUrlToDelete) {
        filesToDeleteFromDropbox.push(imageUrlToDelete);
    }
      courseToDelete.modulos.forEach(modulo => {
        modulo.contenido.forEach(contenido => {
            if (contenido.leccion && contenido.leccion.leccionArchivos) {
                contenido.leccion.leccionArchivos.forEach(file => {
                    filesToDeleteFromDropbox.push(file.url);
                });
            }
        });
    });
    if (filesToDeleteFromDropbox.length > 0) {
        await Promise.all(filesToDeleteFromDropbox.map(url => deleteFileFromDropbox(url)));
    }
    await prisma.$transaction(async (prismaTx) => {
        for (const modulo of courseToDelete.modulos) {
             for (const contenido of modulo.contenido) {
                if (contenido.leccion) {
                    await prismaTx.leccionVideos.deleteMany({ where: { lec_id: contenido.leccion.lec_id } });
                    await prismaTx.leccionArchivos.deleteMany({ where: { lec_id: contenido.leccion.lec_id } });
                    await prismaTx.lecciones.delete({ where: { lec_id: contenido.leccion.lec_id } });
                }
                if (contenido.quiz) {
                    await prismaTx.preguntas.deleteMany({ where: { quiz_id: contenido.quiz.quiz_id } });
                    await prismaTx.quizzes.delete({ where: { quiz_id: contenido.quiz.quiz_id } });
                }
            }
        }
        await prismaTx.constancias.deleteMany({ where: { curso_id: courseId } });
        await prismaTx.modulos.deleteMany({ where: { curso_id: courseId } });
        if (imageIdToDelete) {
          await prismaTx.imagenes.delete({ where: { img_id: imageIdToDelete } });
        }
        await prismaTx.cursos.delete({ where: { curs_id: courseId } });
    });

    res.status(200).json({ message: 'Curso eliminado exitosamente.' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error al eliminar el curso', error: error.message });
  }
});


export default router;