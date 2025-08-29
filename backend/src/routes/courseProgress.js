import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

//to get the progress of 1 course ID
router.get('/course/:id', async (req, res) => {
  const userId = req.user.usu_id;
  const cursoId = parseInt(req.params.id);

  try {
    const progress = await prisma.progresoContenidoModulo.findMany({
      where: {
        usu_id: userId,
        contenido: {
          modulo: {
            curso_id: cursoId,
          },
        },
      },
      include: {
        contenido: {
          select: {
            id: true,
            tipo: true,
            orden: true,
            mod_id: true
          }
        },
      },
    });

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching course progress' });
  }
});

//to get all the prgresses in all the courses which has been started
router.get('/all', async (req, res) => {
  const userId = req.user.usu_id;

  try {
    const contents = await prisma.contenidoModulo.findMany({
      select: {
        id: true,
        mod_id: true,
        modulo: {
          select: {
            curso_id: true,
            curso: {
              select: {
                curs_id: true,
                titulo: true,
              },
            },
          },
        },
      },
    });

    const courseMap = new Map();

    contents.forEach((content) => {
      const courseId = content.modulo.curso_id;
      const courseTitle = content.modulo.curso.titulo;

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId,
          courseTitle,
          totalContents: 0,
          completedContents: 0,
        });
      }

      const course = courseMap.get(courseId);
      course.totalContents += 1;
    });

    const completed = await prisma.progresoContenidoModulo.findMany({
      where: { usu_id: userId, completado: true },
      select: {
        contenido: {
          select: {
            id: true,
            mod_id: true,
            modulo: {
              select: {
                curso_id: true,
              },
            },
          },
        },
      },
    });

    completed.forEach((item) => {
      const courseId = item.contenido.modulo.curso_id;
      if (courseMap.has(courseId)) {
        courseMap.get(courseId).completedContents += 1;
      }
    });

    const results = Array.from(courseMap.values()).map((course) => ({
      ...course,
      percentage: course.totalContents > 0
        ? Math.round((course.completedContents / course.totalContents) * 100)
        : 0,
    }));

    res.json(results);
  } catch (error) {
    console.error('Error fetching all course progress:', error);
    res.status(500).json({ message: 'Error fetching all progress' });
  }
});

//to register progress (like when a content is started)
router.post('/add/:id', async (req, res) => {
  const userId = req.user.usu_id;
  const contenidoId = parseInt(req.params.id);

  try {
    const existing = await prisma.progresoContenidoModulo.findUnique({
      where: {
        usu_id_contenido_id: {
          usu_id: userId,
          contenido_id: contenidoId,
        },
      },
    });

    if (!existing) {
      const progress = await prisma.progresoContenidoModulo.create({
        data: {
          usu_id: userId,
          contenido_id: contenidoId,
        },
      });
      return res.status(201).json(progress);
    } else {
      return res.status(200).json(existing);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering progress' });
  }
});

router.patch('/completed/:id', async (req, res) => {
  const userId = req.user.usu_id;
  const contenidoId = parseInt(req.params.id);

  try {
    const progress = await prisma.progresoContenidoModulo.update({
      where: {
        usu_id_contenido_id: {
          usu_id: userId,
          contenido_id: contenidoId,
        },
      },
      data: {
        completado: true,
      },
    });

    return res.status(200).json({ message: 'Contenido marcado como completado', progress });
  } catch (error) {
    console.error('Error updating completion status:', error);
    res.status(500).json({ message: 'Error registering progress' });
  }
});

//to get in what content it was left of (to then start from there)
router.get('/current-course/:id', async (req, res) => {
  const userId = req.user.usu_id;
  const cursoId = parseInt(req.params.id);

  try {
    const allProgress = await prisma.progresoContenidoModulo.findMany({
  where: {
    usu_id: userId,
  },
  include: {
    contenido: {
      include: {
        modulo: {
          select: { titulo: true, orden: true, curso_id: true },
        },
      },
    },
  },
  orderBy: {
    fecha_creacion: 'desc',
  },
});

const lastProgress = allProgress.find(
  (p) => p.contenido?.modulo?.curso_id === cursoId
);

    const content = lastProgress?.contenido;

    if (content) {
       return res.json({
        contenidoId: content.id,
        moduloId: content.mod_id,
        orden: content.orden,
        tipo: content.tipo,
        titulo: content.modulo?.titulo,
        lec_id: content.lec_id ?? null,
        quiz_id: content.quiz_id ?? null,
      });
    }

    // fallback to first content if no progress
    const firstContent = await prisma.contenidoModulo.findFirst({
      where: {
        modulo: {
          curso_id: cursoId,
        },
      },
      orderBy: [
        { modulo: { orden: 'asc' } },
        { orden: 'asc' },
      ],
      include: {
        modulo: {
          select: {
            titulo: true,
            orden: true,
          },
        },
      },
    });

    if (!firstContent) {
      return res.status(404).json({ message: 'No content found in this course' });
    }

    return res.json({
      contenidoId: firstContent.id,
      moduloId: firstContent.mod_id,
      orden: firstContent.orden,
      tipo: firstContent.tipo,
      titulo: firstContent.modulo?.titulo,
      lec_id: firstContent.lec_id ?? null,
      quiz_id: firstContent.quiz_id ?? null
    });

  } catch (error) {
    console.error('Error fetching current progress or first content:', error);
    res.status(500).json({ message: 'Error fetching current course content' });
  }
});

router.get('/course/:id/percentage', async (req, res) => {
  const userId = req.user.usu_id;
  const courseId = parseInt(req.params.id);

  try {
    const totalContents = await prisma.contenidoModulo.count({
      where: {
        modulo: {
          curso_id: courseId,
        },
      },
    });

    if (totalContents === 0) {
      return res.status(200).json({
        courseId,
        totalContents: 0,
        completedContents: 0,
        percentage: 0,
      });
    }

    const completedContents = await prisma.progresoContenidoModulo.count({
      where: {
        usu_id: userId,
        contenido: {
          modulo: {
            curso_id: courseId,
          },
        },
        completado: true,
      },
    });

    const percentage = (completedContents / totalContents) * 100;

    res.json({
      courseId,
      totalContents,
      completedContents,
      percentage: Math.round(percentage),
    });
  } catch (error) {
    console.error('Error fetching course percentage:', error);
    res.status(500).json({ message: 'Error fetching course progress percentage' });
  }
});

router.get('/next/:contenidoId', async (req, res) => {
  const userId = req.user.usu_id; // Assuming req.user is populated by middleware
  const currentContenidoId = parseInt(req.params.contenidoId);

  try {
    const currentContent = await prisma.contenidoModulo.findUnique({
      where: { id: currentContenidoId },
      include: {
        modulo: true,
      },
    });

    if (!currentContent) {
      return res.status(404).json({ message: 'Contenido actual no encontrado' });
    }

    const currentModuloOrden = currentContent.modulo.orden;
    const currentOrden = currentContent.orden;
    const cursoId = currentContent.modulo.curso_id;

    // --- CASE 1: Find next content in the SAME module ---
    const nextInSameModule = await prisma.contenidoModulo.findFirst({
      where: {
        mod_id: currentContent.mod_id,
        orden: {
          gt: currentOrden,
        },
      },
      orderBy: {
        orden: 'asc',
      },
      include: {
        modulo: {
          select: { titulo: true },
        },
        // *** ADD THESE INCLUDES ***
        leccion: {
            select: { lec_id: true } // Select the actual lesson ID
        },
        quiz: {
            select: { quiz_id: true } // Select the actual quiz ID
        }
      },
    });

    if (nextInSameModule) {
      return res.json({
        contenidoId: nextInSameModule.id,
        moduloId: nextInSameModule.mod_id,
        orden: nextInSameModule.orden,
        tipo: nextInSameModule.tipo,
        titulo: nextInSameModule.modulo?.titulo,
        // *** RETURN THE IDs BASED ON TYPE ***
        leccionId: nextInSameModule.leccion?.lec_id || null, // Ensure to return null if not a lesson
        quizId: nextInSameModule.quiz?.quiz_id || null,     // Ensure to return null if not a quiz
        fin: false // Explicitly state not the end
      });
    }

    // --- CASE 2: Find next module in the SAME course ---
    const nextModule = await prisma.modulos.findFirst({
      where: {
        curso_id: cursoId,
        orden: {
          gt: currentModuloOrden,
        },
      },
      orderBy: {
        orden: 'asc',
      },
    });

    if (nextModule) {
      // Find the first content in the next module
      const firstInNextModule = await prisma.contenidoModulo.findFirst({
        where: {
          mod_id: nextModule.mod_id,
        },
        orderBy: {
          orden: 'asc',
        },
        include: {
          modulo: {
            select: { titulo: true },
          },
          // *** ADD THESE INCLUDES ***
          leccion: {
              select: { lec_id: true } // Select the actual lesson ID
          },
          quiz: {
              select: { quiz_id: true } // Select the actual quiz ID
          }
        },
      });

      if (firstInNextModule) {
        return res.json({
          contenidoId: firstInNextModule.id,
          moduloId: firstInNextModule.mod_id,
          orden: firstInNextModule.orden,
          tipo: firstInNextModule.tipo,
          titulo: firstInNextModule.modulo?.titulo,
          // *** RETURN THE IDs BASED ON TYPE ***
          leccionId: firstInNextModule.leccion?.lec_id || null,
          quizId: firstInNextModule.quiz?.quiz_id || null,
          fin: false // Explicitly state not the end
        });
      }
    }

    // --- CASE 3: No more content/modules found (End of course) ---
    return res.status(200).json({ message: 'Fin del curso', fin: true });

  } catch (error) {
    console.error('Error fetching next content:', error); // More specific error logging
    res.status(500).json({ message: 'Error obteniendo el siguiente contenido' });
  }
});

router.get('/contenido-id', async (req, res) => {
  const { tipo, id } = req.query;

  if (!tipo || !id) {
    return res.status(400).json({ message: 'Missing tipo or id in query' });
  }

  try {
    let contenido;

    if (tipo === 'Leccion') {
      contenido = await prisma.contenidoModulo.findFirst({
        where: { lec_id: parseInt(id) },
        select: { id: true },
      });
    } else if (tipo === 'Cuestionario') {
      contenido = await prisma.contenidoModulo.findFirst({
        where: { quiz_id: parseInt(id) },
        select: { id: true },
      });
    } else {
      return res.status(400).json({ message: 'Tipo must be Leccion or Cuestionario' });
    }

    if (!contenido) {
      return res.status(404).json({ message: 'Contenido no encontrado para ese tipo e id' });
    }

    res.json({ contenidoId: contenido.id });
  } catch (error) {
    console.error('Error fetching contenidoId by tipo and id:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



export default router;