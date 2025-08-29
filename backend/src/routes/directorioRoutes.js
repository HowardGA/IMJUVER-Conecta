import { Router } from 'express';
import prisma from '../prismaClient.js';
import { sendNotificationToRole } from '../services/emailService.js';

const router = Router();

// Get all directory entries
router.get('/', async (req, res) => {
  try {
    const directorios = await prisma.directorio.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
    res.status(200).json(directorios);
  } catch (error) {
    console.error('Error fetching directory:', error);
    res.status(500).json({ error: 'Failed to fetch directory entries' });
  }
});

// Get single directory entry
router.get('/single/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const directorio = await prisma.directorio.findUnique({
      where: { dir_id: Number(id) },
      include: {
        categoria: true,
      },
    });

    if (!directorio) {
      return res.status(404).json({ error: 'Directory entry not found' });
    }

    res.status(200).json(directorio);
  } catch (error) {
    console.error('Error fetching directory entry:', error);
    res.status(500).json({ error: 'Failed to fetch directory entry' });
  }
});

// Create new directory entry
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    let categoryName = 'una nueva categoría';
    if (data.cat_dir_id) {
        const category = await prisma.categorias_Directorio.findUnique({
            where: { cat_dir_id: Number(data.cat_dir_id) }
        });
        if (category) {
            categoryName = category.nombre;
        }
    }

    const directorio = await prisma.directorio.create({
      data: {
        ...data,
        cat_dir_id: Number(data.cat_dir_id),
      },
    });
    const youngPeopleRoleId = 2; 
    const notificationSubject = `¡Nuevo Contacto en el Directorio de IMJUVER Conecta!`;
    const notificationMessage = `
        ¡Atención joven! Se ha añadido un nuevo contacto en el Directorio de IMJUVER Conecta bajo la categoría de <strong>${categoryName}</strong>.
        <br><br>
        Ahora tienes acceso a más recursos importantes. ¡Revísalo para descubrir de qué se trata!
    `;
    const buttonText = 'Explorar Directorio';
    const directoryUrl = `/directory`;
    sendNotificationToRole(
      youngPeopleRoleId,
      notificationSubject,
      notificationMessage,
      buttonText,
      directoryUrl
    ).then(result => {
      console.log('Notification for new directory entry initiated:', result);
    }).catch(err => {
      console.error('Failed to initiate notification for new directory entry:', err);
    });
    res.status(201).json(directorio);
  } catch (error) {
    console.error('Error creating directory entry:', error);
    res.status(500).json({ error: 'Failed to create directory entry' });
  }
});

// Update directory entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updatedDirectorio = await prisma.directorio.update({
      where: { dir_id: Number(id) },
      data: {
        ...data,
        cat_dir_id: data.cat_dir_id ? Number(data.cat_dir_id) : undefined,
        fecha_modificacion: new Date(),
      },
    });

    res.status(200).json(updatedDirectorio);
  } catch (error) {
    console.error('Error updating directory entry:', error);
    res.status(500).json({ error: 'Failed to update directory entry' });
  }
});

// Delete directory entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.directorio.delete({
      where: { dir_id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting directory entry:', error);
    res.status(500).json({ error: 'Failed to delete directory entry' });
  }
});

// Get all categories for directory
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await prisma.categorias_Directorio.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
    
    const options = categorias.map(cat => ({
      label: cat.nombre,
      value: cat.cat_dir_id,
    }));

    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching directory categories:', error);
    res.status(500).json({ error: 'Failed to fetch directory categories' });
  }
});

export default router;