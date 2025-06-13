import uploadFiles from '../middleware/uploadFile.js';

import express from 'express';
import  prisma  from '../prismaClient.js';
import upload from '../middleware/upload.js';
import path from 'path';

const router = express.Router();
const tipoQuiz = 'Cuestionario';

//save a course
router.post('/', upload.single('portada'), async (req, res) => {
  try {
    const { titulo, descripcion, cat_cursos_id, duracion, nivel, modulos } = req.body;
    if (!titulo || !descripcion || !cat_cursos_id || !duracion || !nivel) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    let parsedModulos;
    try {
      parsedModulos = typeof modulos === 'string' ? JSON.parse(modulos) : modulos;
      if (!Array.isArray(parsedModulos) || parsedModulos.length === 0) {
        return res.status(400).json({ message: 'Debe agregar al menos un módulo' });
      }
    } catch (e) {
      return res.status(400).json({ message: 'Formato inválido para módulos' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'La imagen portada es requerida',body: req.body });
    }

    const recurso = await prisma.imagenes.create({
      data: {
        url: req.file.path,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      }
    });

    const curso = await prisma.cursos.create({
      data: {
        titulo,
        descripcion,
        cat_cursos_id: parseInt(cat_cursos_id),
        duracion: parseInt(duracion),
        nivel,
        portada_id: recurso.img_id,
        constancia: false,
        publicado: false,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      }
    });

    await prisma.modulos.createMany({
      data: parsedModulos.map((modulo, index) => ({
        titulo: modulo.titulo,
        descripcion: modulo.descripcion,
        curso_id: curso.curs_id,
        orden: index + 1,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      }))
    });

    res.status(201).json({ message: 'Curso creado exitosamente', curso });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Error al guardar el curso',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

//delete a course
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await prisma.cursos.findUnique({
            where: { curs_id: parseInt(id) }
        });

        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        await prisma.cursos.delete({
            where: { curs_id: parseInt(id) }
        });

        res.status(200).json({ message: 'Curso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el curso' });
    }
});

//get all courses
router.get('/', async (req, res) => {
    try {
        const cursos = await prisma.cursos.findMany({
            include: {
                modulos: true,
                portada: true,
                categoria: true
            }
        });

    const cursosWithPublicUrls = cursos.map(curso => ({
      ...curso,
      portada: curso.portada ? {
        ...curso.portada,
        url: `${process.env.SERVER_URL || 'http://localhost:3001'}/uploads/${path.basename(curso.portada.url)}`
      } : null
    }));

    res.status(200).json(cursosWithPublicUrls);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cursos', error: error.message });
    }
});

router.post('/lessons', uploadFiles.array('archivos'), async (req, res) => {
  try {
    const { titulo, contenido, mod_id, youtube_videos } = req.body;
    const uploadedFiles = req.files;
    const parsedContenido = JSON.parse(contenido);
    const parsedYoutubeVideos = JSON.parse(youtube_videos);

    const maxOrdenContenido = await prisma.contenidoModulo.aggregate({
      where: { mod_id: parseInt(mod_id) },
      _max: { orden: true }
    });

    const newOrden = (maxOrdenContenido._max.orden || 0) + 1;

    const result = await prisma.$transaction(async (prismaTx) => {
      const lesson = await prismaTx.lecciones.create({
        data: {
          titulo,
          contenido: parsedContenido,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date()
        }
      });

      if (parsedYoutubeVideos?.length > 0) {
        await prismaTx.leccionVideos.createMany({
          data: parsedYoutubeVideos.map(video => ({
            lec_id: lesson.lec_id,
            video_id: video
          }))
        });
      }

      if (uploadedFiles?.length > 0) {
        await prismaTx.leccionArchivos.createMany({
          data: uploadedFiles.map(file => ({ 
            lec_id: lesson.lec_id,
            url: `/uploads/files/${file.filename}`,
            nombre: file.originalname,
            tipo: file.mimetype
          }))
        });
      }

      const contenidoModuloEntry = await prismaTx.contenidoModulo.create({
        data: {
          mod_id: parseInt(mod_id),
          orden: newOrden,
          tipo: 'leccion', 
          lec_id: lesson.lec_id, 
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        }
      });

      return { lesson, contenidoModuloEntry };
    });

    res.status(201).json({
      message: 'Lección creada y asociada al módulo',
      lesson: result.lesson,
      contenidoModulo: result.contenidoModuloEntry
    });

  } catch (error) {
    console.error('Error creating lesson:', error);
    if (error instanceof multer.MulterError) {
      console.error('Multer Error Code:', error.code);
      console.error('Multer Error Field Name:', error.field);
    }
    res.status(500).json({ message: 'Error al crear la lección' });
  }
});

router.get('/lessons/by-course/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const modulesWithLessons = await prisma.modulos.findMany({
      where: { curso_id: parseInt(courseId) },
      orderBy: { orden: 'asc' },
      select: {
        mod_id: true,
        titulo: true,
        orden: true,
        lecciones: {
          orderBy: { orden: 'asc' },
          select: {
            lec_id: true,
            titulo: true,
            orden: true,
            fecha_creacion: true,
            fecha_modificacion: true,
          }
        }
      }
    });

    res.json(modulesWithLessons);
  } catch (error) {
    console.error("Error fetching lessons by course:", error);
    res.status(500).json({ message: "Error al obtener las lecciones del curso" });
  }
});

router.get('/lessons/:id', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);

    const lesson = await prisma.lecciones.findUnique({
      where: { lec_id: lessonId },
      include: {
        videos: true, 
        archivos: true 
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lección no encontrada' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Error al obtener la lección' });
  }
});

router.get('/:id/full', async (req, res) => {
  const { id } = req.params;

  try {
    const curso = await prisma.cursos.findUnique({
      where: { curs_id: parseInt(id) },
      include: {
        categoria: true,
        portada: true,
        modulos: {
          orderBy: { orden: 'asc' },
          include: {
            contenido: {
              orderBy: { orden: 'asc' },
              include: {
                leccion: {
                  select: { 
                    lec_id: true,
                    titulo: true,
                  }
                },
                quiz: {
                  select: {
                    quiz_id: true,
                    titulo: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';
    const cursoConUrl = {
      ...curso,
      portada: curso.portada
        ? {
            ...curso.portada,
            url: `${serverUrl}/uploads/${path.basename(curso.portada.url)}`
          }
        : null
    };

    res.status(200).json(cursoConUrl);

  } catch (error) {
    console.error('Error al obtener curso completo:', error);
    res.status(500).json({ message: 'Error al obtener el curso completo' });
  }
});

router.get('/:id/modules', async (req, res) => {
  const { id } = req.params;

  try {
    const modulos = await prisma.modulos.findMany({
      where: { curso_id: parseInt(id) },
      orderBy: { orden: 'asc' },
      select: {
        mod_id: true,
        titulo: true,
        descripcion: true,
        orden: true,
        contenido: {
          orderBy: { orden: 'asc' },
          include:{
            leccion:{
              select:{
                lec_id: true,
                titulo: true
              }
            },
            quiz:{
              select:{
                quiz_id: true,
                titulo: true
              }
            }
          }
        }
      }
    });

    if (modulos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron módulos para este curso' });
    }

    res.status(200).json(modulos);
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    res.status(500).json({ message: 'Error al obtener los módulos del curso' });
  }
});

router.post('/quiz', async (req, res) => {
  const {mod_id, titulo, descripcion, preguntas, courseId} = req.body;
  if (!mod_id || !titulo || !descripcion || !preguntas || !Array.isArray(preguntas) ||!courseId) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }
  try{
    const maxOrdenContenido = await prisma.contenidoModulo.aggregate({
      where: { mod_id: parseInt(mod_id) },
      _max: { orden: true }
    });

    const newOrden = (maxOrdenContenido._max.orden || 0) + 1;
    const result = await prisma.$transaction(async (prismaTx) => {
      const quiz = await prismaTx.quizzes.create({
        data: {
          titulo: titulo,
          descripcion: descripcion,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date()
        }
      });
      const createdQuestions = []; 
      for (const pregunta of preguntas) {
        const createdQuestion = await prismaTx.quizPreguntas.create({
          data: {
            texto_pregunta:pregunta.texto_pregunta,
            tipo_pregunta:pregunta.tipo_pregunta,
            quiz_id: quiz.quiz_id
          }
          })
          console.log(createdQuestion)
          const createdAnswers = await Promise.all(
          pregunta.respuestas.map(respuesta => {
             return prismaTx.quizRespuestas.create({
          data: {
            texto_respuesta: respuesta.texto_respuesta,
            correcta: respuesta.correcta,
            pregunta_id: createdQuestion.pregunta_id
           }
        });
          })
        )
        createdQuestions.push({ ...createdQuestion, respuestas: createdAnswers });
      }
      await prismaTx.contenidoModulo.create({
        data: {
          mod_id: parseInt(mod_id),
          orden: newOrden,
          tipo: tipoQuiz,
          quiz_id: quiz.quiz_id,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date()
        }
      })
       return {
        message: 'Cuestionario creado con exito',
        courseId: courseId
      };
    })
    res.status(200).json(result);
  }catch (error) {
    console.error('Error al crear el cuestionario:', error);
    res.status(500).json({ message: 'Error al crear el cuestionario', error: error.message });
  }
});

router.get('/quiz/:quiz_id', async (req, res) => {
    const quiz_id = parseInt(req.params.quiz_id);

    if (isNaN(quiz_id)) {
        return res.status(400).json({ message: 'Invalid quiz ID' });
    }

    try {
        const quiz = await prisma.quizzes.findUnique({
            where: { quiz_id: quiz_id },
            include: {
                preguntas: {
                    include: {
                        respuestas: {
                            select: { 
                                respuesta_id: true,
                                texto_respuesta: true,
                            }
                        }
                    }
                }
            }
        });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz);

    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Error fetching quiz' });
    }
});

router.post('/quiz/:quiz_id/submit', async (req, res) => {
    const quiz_id = parseInt(req.params.quiz_id);
    const { answers } = req.body;

    if (isNaN(quiz_id) || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Invalid quiz ID or answers data' });
    }

    try {
        const quizWithCorrectAnswers = await prisma.quizzes.findUnique({
            where: { quiz_id: quiz_id },
            include: {
                preguntas: {
                    include: {
                        respuestas: true
                    }
                }
            }
        });

        if (!quizWithCorrectAnswers) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;
        const results = [];

        for (const userAnswer of answers) {
            const questionInDb = quizWithCorrectAnswers.preguntas.find(
                q => q.pregunta_id === userAnswer.pregunta_id
            );

            if (!questionInDb) {
                results.push({ pregunta_id: userAnswer.pregunta_id, status: 'Question not found' });
                continue;
            }

            let isQuestionCorrect = false;

            if (questionInDb.tipo_pregunta === 'SINGLE_CHOICE' || questionInDb.tipo_pregunta === 'TRUE_FALSE') {
                const selectedAnswerId = userAnswer.selected_respuesta_ids[0];
                const correctAnswerInDb = questionInDb.respuestas.find(r => r.correcta === true);

                if (correctAnswerInDb && selectedAnswerId === correctAnswerInDb.respuesta_id) {
                    isQuestionCorrect = true;
                    score++;
                }
            } else if (questionInDb.tipo_pregunta === 'MULTIPLE_CHOICE') {
                const correctAnswersInDb = questionInDb.respuestas.filter(r => r.correcta).map(r => r.respuesta_id);
                const allCorrectSelected = correctAnswersInDb.every(id => userAnswer.selected_respuesta_ids.includes(id));
                const noIncorrectSelected = userAnswer.selected_respuesta_ids.every(id => correctAnswersInDb.includes(id));

                if (allCorrectSelected && noIncorrectSelected && correctAnswersInDb.length === userAnswer.selected_respuesta_ids.length) {
                    isQuestionCorrect = true;
                    score++;
                }
            }

            results.push({
                pregunta_id: userAnswer.pregunta_id,
                is_correct: isQuestionCorrect,
                submitted_answers: userAnswer.selected_respuesta_ids,
                correct_answers: questionInDb.respuestas.filter(r => r.correcta).map(r => r.respuesta_id)
            });
        }

        res.status(200).json({
            message: 'Quiz submitted successfully',
            score: score,
            totalQuestions: quizWithCorrectAnswers.preguntas.length,
            results: results
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Error submitting quiz' });
    }
});


export default router;