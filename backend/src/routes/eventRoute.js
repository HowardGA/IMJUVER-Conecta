import express from 'express';
import prisma from '../prismaClient.js';
import authenticateToken from '../middleware/authMiddleware.js';
import uploadMultiple from '../middleware/mixedMulter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveFileToDisk } from '../middleware/mixedMulter.js';
import { deletePhysicalFiles } from '../utils/fileDeletionUtils.js';
import {sendNotificationToRole} from '../services/emailService.js'; 
import { uploadFileToDropbox, deleteFileFromDropbox } from '../services/dropboxUploader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const rootDir = path.resolve(__dirname, '../../');

router.get('/featured', async (req, res) => {
    try {
        const featuredAnnouncements = await prisma.publicaciones.findMany({
            where: {
                visible: true,
                destacado: true,
            },
            orderBy: [
                { fecha_evento: 'asc' }, // Order by event date ascending
                { fecha_creacion: 'desc' }, // Then by creation date descending
            ],
            include: {
                categoria: true,
                autor: true,
                publicacionImagenes: { // Include the pivot table for images
                    orderBy: {
                        // You might have an 'order' field on PublicacionImagen,
                        // if so, order by that to ensure a consistent 'first' image.
                        // For now, let's assume default order or creation order.
                        imagen_id: 'asc', // Or 'publicacion_id: 'asc'' if order is not crucial
                    },
                    take: 1, // <<< This is key: only fetch 1 image link from the pivot table
                    include: {
                        imagen: true, // Then include the actual Imagen model data
                    },
                },
                publicacionRecursos: { // Include the pivot table for resources
                    include: {
                        recurso: true, // Then include the actual Recurso model data
                    },
                },
            }
        });
        // const baseURL = `${req.protocol}://${req.get('host')}/`; // Your base URL for static files
        const featuredAnnouncementsWithURLs = featuredAnnouncements.map((a) => {
            const firstImage = a.publicacionImagenes.length > 0 ? a.publicacionImagenes[0].imagen : null;
//comentado porque es la logica que guarda localmente
            // return {
            //     ...a,
            //     imagen_url: firstImage ? `${baseURL}${firstImage.url}` : null,
            //     imagen_data: firstImage ? {
            //         img_id: firstImage.img_id,
            //         url: `${baseURL}${firstImage.url}`,
            //         fecha_creacion: firstImage.fecha_creacion,
            //         fecha_modificacion: firstImage.fecha_modificacion,
            //     } : null,

            //     recursos: a.publicacionRecursos.map(pr => ({
            //         rec_id: pr.recurso.rec_id,
            //         url: `${baseURL}${pr.recurso.url}`,
            //         titulo: pr.recurso.titulo,
            //         descripcion: pr.recurso.descripcion,
            //         fecha_creacion: pr.recurso.fecha_creacion,
            //         fecha_modificacion: pr.recurso.fecha_modificacion,
            //     })),

            //     publicacionImagenes: undefined,
            //     publicacionRecursos: undefined,
            // };
            //utilizando roblox se usa:
          return {
            ...a,
            imagen_url: firstImage ? firstImage.url : null,
            imagen_data: firstImage ? {
              img_id: firstImage.img_id,
              url: firstImage.url,
              fecha_creacion: firstImage.fecha_creacion,
              fecha_modificacion: firstImage.fecha_modificacion,
            } : null,
            recursos: a.publicacionRecursos.map(pr => ({
              rec_id: pr.recurso.rec_id,
              url: pr.recurso.url,
              titulo: pr.recurso.titulo,
              descripcion: pr.recurso.descripcion,
              fecha_creacion: pr.recurso.fecha_creacion,
              fecha_modificacion: pr.recurso.fecha_modificacion,
            })),
            publicacionImagenes: undefined,
            publicacionRecursos: undefined,
          };
        });
        res.status(200).json(featuredAnnouncementsWithURLs);
    } catch (error) {
        console.error('Error fetching featured announcements:', error);
        res.status(500).json({
            message: 'Failed to retrieve featured announcements',
            error: error.message
        });
    }
});

router.post('/', uploadMultiple, async  (req, res) => {
    try {
        const {
            titulo,
            contenido,
            cat_pub_id,
            autor_id,
            visible,
            destacado,
            fecha_evento
        } = req.body;
        const files = req.files;
        const uploadedImages = files && files.imagen ? files.imagen : [];
        const uploadedResources = files && files.recurso ? files.recurso : [];
        if (!titulo || !contenido || !cat_pub_id || !autor_id) {
            return res.status(400).json({ message: 'Se requiere: titulo, contenido, cat_pub_id, autor_id.' });
        }

        if (uploadedImages.length === 0 && uploadedResources.length === 0) {
            return res.status(400).json({ message: 'Se requiere al menos una imagen o un recurso.' });
        }
        const catPubIdInt = parseInt(cat_pub_id, 10);
        const autorIdInt = parseInt(autor_id, 10);
        const visibleBool = visible === 'true';
        const destacadoBool = destacado === 'true';
        const fechaEventoDate = fecha_evento ? new Date(fecha_evento) : null;
        const newPublication = await prisma.publicaciones.create({
          data: {
            titulo,
            contenido,
            cat_pub_id: catPubIdInt,
            autor_id: autorIdInt,
            visible: visibleBool,
            destacado: destacadoBool,
            fecha_evento: fechaEventoDate,
          },
        });

        const publicationId = newPublication.pub_id;
        // Codigo comentado porque es lo que funciona localmente para guardar los archivos, esto serīa utilizado en una vps
        // const imageLinksPromises = uploadedImages.map(async (file) => {
        //   // Pass fieldname to saveFileToDisk to guide directory choice
        //   const relativePath = await saveFileToDisk(file.buffer, file.originalname, 'imagen');
        //   const newImage = await prisma.imagenes.create({
        //     data: {
        //       url: relativePath,
        //       fecha_creacion: new Date(),
        //       fecha_modificacion: new Date(),
        //     }
        //   });
        //   return prisma.publicacionImagen.create({
        //     data: {
        //       publicacion_id: publicationId,
        //       imagen_id: newImage.img_id,
        //     }
        //   });
        // });

        // const resourceLinksPromises = uploadedResources.map(async (file) => {
        //   const relativePath = await saveFileToDisk(file.buffer, file.originalname, 'recurso');
        //   const newResource = await prisma.recursos.create({
        //     data: {
        //       url: relativePath,
        //       fecha_creacion: new Date(),
        //       fecha_modificacion: new Date(),
        //       titulo: file.originalname,
        //       descripcion: null,
        //   }});
        //   return prisma.publicacionRecurso.create({
        //     data: {
        //       publicacion_id: publicationId,
        //       recurso_id: newResource.rec_id,
        //     }
        //   });
        // });
        const imageLinksPromises = uploadedImages.map(async (file) => {
          // Use the new Dropbox function here
          const dropboxUrl = await uploadFileToDropbox(file.buffer, file.originalname, 'imagen');
          const newImage = await prisma.imagenes.create({
            data: {
              url: dropboxUrl, // Store the Dropbox path
              fecha_creacion: new Date(),
              fecha_modificacion: new Date(),
            }
          });
          return prisma.publicacionImagen.create({
            data: {
              publicacion_id: publicationId,
              imagen_id: newImage.img_id,
            }
          });
        });

        const resourceLinksPromises = uploadedResources.map(async (file) => {
          // Use the new Dropbox function here
          const dropboxUrl = await uploadFileToDropbox(file.buffer, file.originalname, 'recurso');
          const newResource = await prisma.recursos.create({
            data: {
              url: dropboxUrl, // Store the Dropbox path
              fecha_creacion: new Date(),
              fecha_modificacion: new Date(),
              titulo: file.originalname,
              descripcion: null,
          }});
          return prisma.publicacionRecurso.create({
            data: {
              publicacion_id: publicationId,
              recurso_id: newResource.rec_id,
            }
          });
        });
        await Promise.all([...imageLinksPromises, ...resourceLinksPromises]);
        const finalPublication = await prisma.publicaciones.findUnique({
          where: { pub_id: publicationId },
          include: {
            publicacionImagenes: {
              include: {
                imagen: true
              }
            },
            publicacionRecursos: {
              include: {
                recurso: true
              }
            },
          },
        });

      const roleIdToSendTo = 2; 
      const notificationSubject = '¡Nuevo Anuncio Importante de IMJUVER!';
      const notificationMessage = `Atención joven, ¡hay un nuevo <strong>Anuncio</strong> creado en IMJUVER Conecta! Accede a la página para descubrir de qué trata.`;
      const buttonText = 'Ver Nuevo Anuncio';
      const announcementUrl = `/announcements/${finalPublication.pub_id}`;

      sendNotificationToRole(
      roleIdToSendTo,
      notificationSubject,
      notificationMessage,
      buttonText,
      announcementUrl
    ).then(result => {
      console.log('Notification sending initiated:', result);
    }).catch(err => {
      console.error('Failed to initiate notification sending:', err);
    });

      res.status(201).json(finalPublication);

    } catch (error) {
        console.error('Error creating announcement (caught in main handler):', error);
        // Ensure error is stringified or just use error for simple cases
        res.status(500).json({ message: 'Failed to create announcement', error: error.message || 'Unknown error' });
    }
});

//update announcement
router.patch('/:id', authenticateToken, async (req, res) => {
 const { id } = req.params;
    const {titulo, contenido, cat_pub_id, visible, destacado, fecha_evento} = req.body;
    console.log(req.body)
    try {
        const updatedAnnouncement = await prisma.publicaciones.update({
            where: { pub_id: parseInt(id) },
            data: {
                titulo,
                contenido,
                cat_pub_id: Number(cat_pub_id),
                visible: Boolean(visible),
                destacado: Boolean(destacado),
                fecha_modificacion: new Date(), 
                fecha_evento
            },
        });
        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        console.error(`Error updating announcement ${id}:`, error);
        if (error.code === 'P2025') { 
            return res.status(404).json({ message: `Announcement with ID ${id} not found.` });
        }
        res.status(500).json({ message: 'Failed to update announcement', error: error.message });
    }
});

//delete announcement
router.delete('/delete/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const pubId = parseInt(id);
    if (isNaN(pubId)) {
        return res.status(400).json({ message: 'ID de publicación inválido.' });
    }
    try {
        const announcementToDelete = await prisma.publicaciones.findUnique({
            where: { pub_id: pubId },
            select: {
                titulo: true,
                publicacionImagenes: {
                    select: {
                        imagen: {
                            select: { url: true } 
                        }
                    }
                },
                publicacionRecursos: {
                    select: {
                        recurso: {
                            select: { url: true } 
                        }
                    }
                }
            }
        });

        if (!announcementToDelete) {
            return res.status(404).json({ message: `Publicación con ID ${id} no encontrada.` });
        }
        const filesToDelete = [];

        announcementToDelete.publicacionImagenes.forEach(pi => {
            if (pi.imagen && pi.imagen.url) {
                filesToDelete.push(pi.imagen.url); 
            }
        });
        announcementToDelete.publicacionRecursos.forEach(pr => {
            if (pr.recurso && pr.recurso.url) {
                filesToDelete.push(pr.recurso.url);
            }
        });

        //await Promise.all(filesToDelete.map(url => deleteFileFromDropbox(url)));

        const deletedAnnouncement = await prisma.publicaciones.delete({
            where: { pub_id: pubId },
        });
        //Esto borra archivos que esten guardados localmente
        //await deletePhysicalFiles(filesToDelete);
        res.status(200).json({
            message: `Publicación "${announcementToDelete.titulo}" (ID: ${id}) y sus datos relacionados (incluyendo archivos físicos) han sido eliminados permanentemente.`,
            announcement: deletedAnnouncement
        });

    } catch (error) {
        console.error(`Error al eliminar la publicación ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al intentar eliminar la publicación.', error: error.message });
    }
});

//make not visible
router.delete('/:id',authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const softDeletedAnnouncement = await prisma.publicaciones.update({
            where: { pub_id: parseInt(id) },
            data: {
                visible: false,
                fecha_modificacion: new Date(),
            },
        });
        res.status(200).json({
            message: `Announcement with ID ${id} successfully soft-deleted (visible set to false).`,
            announcement: softDeletedAnnouncement
        });
    } catch (error) {
        console.error(`Error soft-deleting announcement ${id}:`, error);
        if (error.code === 'P2025') { 
            return res.status(404).json({ message: `Announcement with ID ${id} not found.` });
        }
        res.status(500).json({ message: 'Failed to soft-delete announcement', error: error.message });
    }
});

//getAnnouncements
router.get('/all/', async (req, res) => {
  const {
    visible,
    destacado,
    cat_pub_id,
    fecha_evento_gte,
    fecha_evento_lte,
    searchTerm
  } = req.query;

  const filters = {};

  if (visible !== undefined) filters.visible = visible === 'true';
  if (destacado !== undefined) filters.destacado = destacado === 'true';

  const catPubIdParsed = Number(cat_pub_id);
  if (!isNaN(catPubIdParsed)) {
    filters.cat_pub_id = catPubIdParsed;
  }

  // --- MODIFIED DATE FILTER LOGIC ---
  let dateConditions = {};
  if (fecha_evento_gte) {
    dateConditions.gte = new Date(fecha_evento_gte);
    includeNullFechaEvento = true; // If a date filter is applied, also consider nulls
  }
  if (fecha_evento_lte) {
    dateConditions.lte = new Date(fecha_evento_lte);
    includeNullFechaEvento = true; // If a date filter is applied, also consider nulls
  }

  if (Object.keys(dateConditions).length > 0) {
    // If any date filter is present, create an OR condition
    // to include either matching dates OR where fecha_evento is null.
    filters.OR = [
      ...(filters.OR || []), // Preserve any existing OR conditions from searchTerm
      { fecha_evento: dateConditions },
      { fecha_evento: null }
    ];
  }
  // --- END MODIFIED DATE FILTER LOGIC ---


  if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    // If you already have an OR for date conditions, merge them
    // Otherwise, create a new OR array
    filters.OR = [
      ...(filters.OR || []), // Preserve existing OR from date conditions
      { titulo: { contains: searchTerm.trim(), mode: 'insensitive' } },
      { contenido: { contains: searchTerm.trim(), mode: 'insensitive' } },
      {
        publicacionImagenes: {
          some: {
            imagen: {
              url: { contains: searchTerm.trim(), mode: 'insensitive' }
            }
          }
        }
      },
      {
        publicacionRecursos: {
          some: {
            recurso: {
              OR: [
                { titulo: { contains: searchTerm.trim(), mode: 'insensitive' } },
                { descripcion: { contains: searchTerm.trim(), mode: 'insensitive' } },
                { url: { contains: searchTerm.trim(), mode: 'insensitive' } },
              ]
            }
          }
        }
      }
    ];
  }

  try {
    console.log('Filters applied:', JSON.stringify(filters, null, 2)); 

    const announcements = await prisma.publicaciones.findMany({
      where: filters,
      orderBy: {
        fecha_evento: fecha_evento_gte ? 'asc' : undefined, // Orders by event date if GTE is present
        fecha_creacion: !fecha_evento_gte ? 'desc' : undefined, // Otherwise, orders by creation date (most recent first)
      },
      include: {
        categoria: true,
        autor: true,
        publicacionImagenes: {
          orderBy: {
            imagen_id: 'asc',
          },
          take: 1,
          include: {
            imagen: true,
          },
        },
        publicacionRecursos: {
          include: {
            recurso: true,
          },
        },
      }
    });

    //const baseURL = `${req.protocol}://${req.get('host')}/`;

    const announcementsWithURLs = announcements.map((a) => {
      const singleImage = a.publicacionImagenes.length > 0 ? a.publicacionImagenes[0].imagen : null;

      // return {
      //   ...a,
      //   main_image_url: singleImage ? `${baseURL}${singleImage.url}` : null,
      //   main_image_data: singleImage ? {
      //     img_id: singleImage.img_id,
      //     url: `${baseURL}${singleImage.url}`,
      //     fecha_creacion: singleImage.fecha_creacion,
      //     fecha_modificacion: singleImage.fecha_modificacion,
      //   } : null,

      //   recursos: a.publicacionRecursos.map(pr => ({
      //     rec_id: pr.recurso.rec_id,
      //     url: `${baseURL}${pr.recurso.url}`,
      //     titulo: pr.recurso.titulo,
      //     descripcion: pr.recurso.descripcion,
      //     fecha_creacion: pr.recurso.fecha_creacion,
      //     fecha_modificacion: pr.recurso.fecha_modificacion,
      //   })),

      //   publicacionImagenes: undefined,
      //   publicacionRecursos: undefined,
      // };
      return {
        ...a,
        main_image_url: singleImage ? singleImage.url : null,
        main_image_data: singleImage ? {
          img_id: singleImage.img_id,
          url: singleImage.url,
          fecha_creacion: singleImage.fecha_creacion,
          fecha_modificacion: singleImage.fecha_modificacion,
        } : null,

        recursos: a.publicacionRecursos.map(pr => ({
          rec_id: pr.recurso.rec_id,
          url: pr.recurso.url,
          titulo: pr.recurso.titulo,
          descripcion: pr.recurso.descripcion,
          fecha_creacion: pr.recurso.fecha_creacion,
          fecha_modificacion: pr.recurso.fecha_modificacion,
        })),

        publicacionImagenes: undefined,
        publicacionRecursos: undefined,
      };
    });
    res.status(200).json(announcementsWithURLs);
    console.log(announcementsWithURLs)
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      message: 'Failed to retrieve announcements',
      error: error.message
    });
  }
});


router.get('/category', async (req, res) => {
    try {
        const categories = await prisma.categorias_Publicaciones.findMany();
        res.status(200).json(categories);

    } catch (error) {
        console.error(`Error fetching announcement categories:`, error);
        res.status(500).json({
            message: 'Error al cargar las categorias de las publicaciones',
            error: error.message
        });
    }
});


//getParticularAnnouncement
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await prisma.publicaciones.findUnique({
      where: { pub_id: parseInt(id) },
      include: {
        categoria: true,
        autor: true,
        publicacionImagenes: { 
          include: {
            imagen: true, 
          },
          orderBy: {
            imagen_id: 'asc', 
          },
        },
        publicacionRecursos: { 
          include: {
            recurso: true,
          },
          orderBy: {
            recurso: {
              rec_id: 'asc', 
            }
          },
        },
      },
    });
    if (!announcement) {
      return res.status(404).json({ message: `Publicación con ID ${id} no fue encontrada.` });
    }
    // const baseURL = `${req.protocol}://${req.get('host')}/`; 
    // const announcementWithURLs = {
    //   ...announcement,
    //   imagenes: announcement.publicacionImagenes.map(pi => ({
    //     img_id: pi.imagen.img_id,
    //     url: `${baseURL}${pi.imagen.url}`, // Full URL
    //     fecha_creacion: pi.imagen.fecha_creacion,
    //     fecha_modificacion: pi.imagen.fecha_modificacion,
    //   })),
    //   recursos: announcement.publicacionRecursos.map(pr => ({
    //     rec_id: pr.recurso.rec_id,
    //     url: `${baseURL}${pr.recurso.url}`, // Full URL
    //     titulo: pr.recurso.titulo,
    //     descripcion: pr.recurso.descripcion,
    //     fecha_creacion: pr.recurso.fecha_creacion,
    //     fecha_modificacion: pr.recurso.fecha_modificacion,
    //   })),
    //   publicacionImagenes: undefined,
    //   publicacionRecursos: undefined,
    // };
    const announcementWithURLs = {
  ...announcement,
  imagenes: announcement.publicacionImagenes.map(pi => ({
    img_id: pi.imagen.img_id,
    url: pi.imagen.url, // Use the URL directly
    fecha_creacion: pi.imagen.fecha_creacion,
    fecha_modificacion: pi.imagen.fecha_modificacion,
  })),
  recursos: announcement.publicacionRecursos.map(pr => ({
    rec_id: pr.recurso.rec_id,
    url: pr.recurso.url, // Use the URL directly
    titulo: pr.recurso.titulo,
    descripcion: pr.recurso.descripcion,
    fecha_creacion: pr.recurso.fecha_creacion,
    fecha_modificacion: pr.recurso.fecha_modificacion,
  })),
  publicacionImagenes: undefined,
  publicacionRecursos: undefined,
};

    res.status(200).json(announcementWithURLs);
  } catch (error) {
    console.error(`Error fetching announcement ${id}:`, error);
    res.status(500).json({ message: 'Error al consultar publicación', error: error.message });
  }
});



export default router;