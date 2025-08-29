import { Router } from 'express';
import prisma from '../prismaClient.js';
import { sendNotificationToRole } from '../services/emailService.js';
const router = Router();

// Create a new job offering
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, cat_of_id, url, fecha_vigencia, activo, mujer } = req.body;
    let categoryName = 'una nueva oferta';
    if (cat_of_id) {
        const category = await prisma.categorias_Ofertas.findUnique({
            where: { cat_of_id: Number(cat_of_id) }
        });
        if (category) {
            categoryName = category.nombre;
        }
    }
    const oferta = await prisma.ofertas.create({
      data: {
        titulo,
        descripcion,
        cat_of_id,
        url,
        fecha_vigencia: new Date(fecha_vigencia),
        activo: activo ?? true,
        mujer: mujer ?? false
      },
    });
    const youngPeopleRoleId = 2; 
    const notificationSubject = `¡Nueva Oportunidad de Empleo en ${oferta.titulo}!`;
    const notificationMessage = `
        ¡Atención joven! Se ha publicado una nueva oferta de empleo en IMJUVER Conecta: <strong>"${oferta.titulo}"</strong>.
        <br><br>
        Esta oportunidad podría ser justo lo que estás buscando, bajo la categoría de <strong>${categoryName}</strong>.
        ¡No la dejes pasar!
    `;
    const buttonText = 'Ver Oferta de Empleo';
    const ofertaUrl = `${process.env.BASE_URL}/jobs`;

    // Send the notification to all young people
    sendNotificationToRole(
      youngPeopleRoleId,
      notificationSubject,
      notificationMessage,
      buttonText,
      ofertaUrl
    ).then(result => {
      console.log('Notification for new job offering initiated:', result);
    }).catch(err => {
      console.error('Failed to initiate notification for new job offering:', err);
    });

    // --- Optional: Send specific notification if it's an offer for women ---
    if (oferta.mujer) {
        // You might have a specific role for women, or just send a more targeted message
        // For simplicity, we'll send it to the same group (Role 2) with a slightly different message
        const womenSpecificSubject = `¡Oportunidad de Empleo Exclusiva para Mujeres: "${oferta.titulo}"!`;
        const womenSpecificMessage = `
            ¡Atención joven! Se ha publicado una nueva oferta de empleo en IMJUVER Conecta: <strong>"${oferta.titulo}"</strong>, diseñada especialmente para mujeres.
            <br><br>
            Explora esta oportunidad única bajo la categoría de <strong>${categoryName}</strong>. ¡Tu futuro te espera!
        `;
        // Re-use buttonText and ofertaUrl

        sendNotificationToRole(
            youngPeopleRoleId, // Still sending to role 2, but with a specific message
            womenSpecificSubject,
            womenSpecificMessage,
            buttonText,
            ofertaUrl
        ).then(result => {
            console.log('Specific notification for women job offering initiated:', result);
        }).catch(err => {
            console.error('Failed to initiate specific notification for women job offering:', err);
        });
    }
    // --- End Optional Notification ---

    res.status(201).json(oferta);
  } catch (error) {
    console.error('Error creating job offering:', error);
    res.status(500).json({ error: 'Failed to create job offering' });
  }
});

// Get all job offerings
router.get('/', async (req, res) => {
  try {
    const ofertas = await prisma.ofertas.findMany({
      include: { categoria: true }, 
    });
    res.status(200).json(ofertas);
  } catch (error) {
    console.error('Error fetching job offerings:', error);
    res.status(500).json({ error: 'Failed to fetch job offerings' });
  }
});

// Get a single job offering by ID
router.get('/single/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const oferta = await prisma.ofertas.findUnique({
      where: { of_id: Number(id) },
      include: { categoria: true },
    });

    if (!oferta) {
      return res.status(404).json({ error: 'Job offering not found' });
    }

    res.status(200).json(oferta);
  } catch (error) {
    console.error('Error fetching job offering:', error);
    res.status(500).json({ error: 'Failed to fetch job offering' });
  }
});

// Update a job offering
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, cat_of_id, url, fecha_vigencia, activo } = req.body;

    const updatedOferta = await prisma.ofertas.update({
      where: { of_id: Number(id) },
      data: {
        titulo,
        descripcion,
        cat_of_id,
        url,
        fecha_vigencia: new Date(fecha_vigencia),
        activo,
        fecha_modificacion: new Date(), 
      },
    });

    res.status(200).json(updatedOferta);
  } catch (error) {
    console.error('Error updating job offering:', error);
    res.status(500).json({ error: 'Failed to update job offering' });
  }
});

// Delete a job offering
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ofertas.delete({
      where: { of_id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting job offering:', error);
    res.status(500).json({ error: 'Failed to delete job offering' });
  }
});

router.get('/categorias-ofertas', async (req, res) => {
  try {
    const categorias = await prisma.categorias_Ofertas.findMany({
      orderBy: {
        nombre: 'asc',
      },
      select: {
        cat_of_id: true,
        nombre: true,
      },
    });

    // Transform to label-value format
    const options = categorias.map(categoria => ({
      label: categoria.nombre,
      value: categoria.cat_of_id,
    }));

    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch job categories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;