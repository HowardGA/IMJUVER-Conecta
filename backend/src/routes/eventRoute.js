import express from 'express';
import prisma from '../prismaClient.js';
import authenticateToken from '../middleware/authMiddleware.js';
import uploadMultiple from '../middleware/mixedMulter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadImageToImgBB } from '../services/imgbbService.js';

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
                { fecha_evento: 'asc' }, 
                { fecha_creacion: 'desc' },
            ],
            include: {
                categoria: true,
                imagen: true,
                recurso: true,
                autor: true,
            }
        });
        const baseURL = `${req.protocol}://${req.get('host')}/`;
        const featuredAnnouncementsWithURLs = featuredAnnouncements.map((a) => ({
            ...a,
            imagen_url: a.imagen ? `${baseURL}${a.imagen.url}` : null,
            recurso_url: a.recurso ? `${baseURL}${a.recurso.url}` : null,
        }));
        res.status(200).json(featuredAnnouncementsWithURLs);
    } catch (error) {
        console.error('Error fetching featured announcements:', error);
        res.status(500).json({
            message: 'Failed to retrieve featured announcements',
            error: error.message
        });
    }
});

router.post('/', uploadMultiple, async (req, res) => {
  const {
    titulo,
    contenido,
    cat_pub_id,
    autor_id,
    visible,
    destacado,
    fecha_evento
  } = req.body;
    const catPubIdInt = parseInt(cat_pub_id, 10);
    const autorIdInt = parseInt(autor_id, 10);
    const hasImage = req.files && req.files.imagen && req.files.imagen.length > 0;
    const hasRecurso = req.files && req.files.recurso && req.files.recurso.length > 0;

  if (!titulo || !contenido || !catPubIdInt || !autorIdInt) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  if (!hasImage && !hasRecurso) {
    return res.status(400).json({ message: 'Se requiere al menos una imagen o un recurso.' });
  }

  try {

    const visibleBool = visible === 'true';
    const destacadoBool = destacado === 'true';
    const fechaEventoDate = fecha_evento ? new Date(fecha_evento) : null;
    // const imagenRelativePath = path.relative(rootDir, req.files.imagen[0].path).replace(/\\/g, '/');
    // const recursoRelativePath = path.relative(rootDir, req.files.recurso[0].path).replace(/\\/g, '/');
    let publicImageUrl = null;
    let publicResourceUrl = null;

    if (hasImage) {
      const imageFile = req.files.imagen[0];
      const imgbbUploadResult = await uploadImageToImgBB(imageFile.buffer, imageFile.originalname);
      publicImageUrl = imgbbUploadResult.url;
    }

    let imagen = null;
      if (publicImageUrl) {
          imagen = await prisma.imagenes.create({
              data: {
                  url: publicImageUrl,
                  fecha_creacion: new Date(),
                  fecha_modificacion: new Date(),
              }
          });
      }

      let recurso = null;
      if (publicResourceUrl) { 
          recurso = await prisma.recursos.create({
              data: {
                  url: publicResourceUrl,
                  fecha_creacion: new Date(),
                  fecha_modificacion: new Date(),
              }
          });
      }

    const newAnnouncement = await prisma.publicaciones.create({
    data: {
        titulo,
        contenido,
        cat_pub_id: catPubIdInt,
        autor_id: autorIdInt,
        img_id: imagen ? imagen.img_id : null,
        recursos_id: recurso ? recurso.rec_id : null,
        visible: visibleBool,
        destacado: destacadoBool,
        fecha_evento: fechaEventoDate,
    },
    });

    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Failed to create announcement', error: error.message });
  }
});


//update announcement
router.patch('/:id', authenticateToken, async (req, res) => {
 const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedAnnouncement = await prisma.publicaciones.update({
            where: { pub_id: parseInt(id) },
            data: {
                ...updateData,
                fecha_modificacion: new Date(), 
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
router.delete('/delete/:id',authenticateToken, async (req, res) => {
 const { id } = req.params;

    try {
        const softDeletedAnnouncement = await prisma.publicaciones.delete({
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

  if (fecha_evento_gte) {
    filters.fecha_evento = {
      ...(filters.fecha_evento || {}),
      gte: new Date(fecha_evento_gte),
    };
  }
  if (fecha_evento_lte) {
    filters.fecha_evento = {
      ...(filters.fecha_evento || {}),
      lte: new Date(fecha_evento_lte),
    };
  }

  if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    filters.OR = [
      { titulo: { contains: searchTerm.trim(), mode: 'insensitive' } },
      { contenido: { contains: searchTerm.trim(), mode: 'insensitive' } },
    ];
  }

  try {
console.log('Filters passed to Prisma:', filters);

    const announcements = await prisma.publicaciones.findMany({
      where: filters,
      orderBy: {
        fecha_evento: fecha_evento_gte ? 'asc' : undefined,
        fecha_creacion: !fecha_evento_gte ? 'desc' : undefined,
      },
      include: {
        categoria: true,
        imagen: true,
        recurso: true,
        autor: true,
      }
    });

    const baseURL = `${req.protocol}://${req.get('host')}/`;

    const announcementsWithURLs = announcements.map((a) => ({
    ...a,
    imagen_url: a.imagen ? `${baseURL}${a.imagen.url}` : null,
    recurso_url: a.recurso ? `${baseURL}${a.recurso.url}` : null,
    }));
console.log('Announcements with URLs:', announcementsWithURLs);

    res.status(200).json(announcementsWithURLs);
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
        imagen: true,
        recurso: true,
        autor: true,
      },
    });

    if (!announcement) {
      return res.status(404).json({ message: `Publicación con ID ${id} no fue encontrada.` });
    }

    const baseURL = `${req.protocol}://${req.get('host')}`;

    const announcementWithURLs = {
      ...announcement,
      imagen_url: announcement.imagen ? `${baseURL}/${announcement.imagen.url}` : null,
      recurso_url: announcement.recurso ? `${baseURL}/${announcement.recurso.url}` : null,
    };

    res.status(200).json(announcementWithURLs);
  } catch (error) {
    console.error(`Error fetching announcement ${id}:`, error);
    res.status(500).json({ message: 'Error al consultar publicación', error: error.message });
  }
});



export default router;