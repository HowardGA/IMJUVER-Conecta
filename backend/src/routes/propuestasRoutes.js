import express from 'express';
import prisma from '../prismaClient.js';
import authenticateToken from '../middleware/authMiddleware.js';
import optionalAuthenticateToken from '../middleware/optionalAuthenticateToken.js';
import { sendNotificationToRole } from '../services/emailService.js';

const router = express.Router();

router.post('/',authenticateToken, async (req, res) => {
    const { titulo, contenido, is_public } = req.body;
    const autorId = req.user.usu_id; 
    console.log('Autor ID:', autorId);
    if (!titulo || !contenido) {
        return res.status(400).json({ error: 'El titulo es requerido.' });
    }
    try {
        const newIdea = await prisma.idea.create({
            data: {
                titulo,
                contenido,
                is_public,
                autor: { connect: { usu_id: autorId } },
            },
        });

        const adminRoleId = 1; 
        const notificationSubject = `¡Nueva Propuesta Ciudadana: "${newIdea.titulo}"!`;
        const notificationMessage = `
            Hola Administrador,<br><br>
            Un joven ha enviado una nueva propuesta titulada: <strong>"${newIdea.titulo}"</strong>.
            <br><br>
            Necesita tu atención para revisión. Haz clic en el botón para ver los detalles.
        `;
        const buttonText = 'Revisar Propuesta Ahora';
        const ideaUrl = `/ideas`;
        sendNotificationToRole(
            adminRoleId,
            notificationSubject,
            notificationMessage,
            buttonText,
            ideaUrl
        ).then(result => {
            console.log('Admin notification for new idea initiated:', result);
        }).catch(err => {
            console.error('Failed to initiate admin notification for new idea:', err);
        });

        res.status(201).json(newIdea);
    } catch (error) {
        console.error('Error creating idea:', error);
        res.status(500).json({ error: 'Error al crear la propuesta.' });
    }
});

router.get('/', optionalAuthenticateToken, async (req, res) => {
    const { limit, offset, sort } = req.query;
    const take = parseInt(limit, 10) || undefined;
    const skip = parseInt(offset, 10) || undefined;
    const currentUserId = req.user ? req.user.usu_id : null; 

     let orderBy = { fecha_creacion: 'desc' };
    if (sort === 'date_asc') {
        orderBy = { fecha_creacion: 'asc' };
    }
    try {
          const ideas = await prisma.idea.findMany({
            where: {
                is_public: true,
                visible: true,
            },
            include: {
                _count: {
                    select: { likes: true, comentarios: true },
                },
                autor: {
                    select: { usu_id: true, nombre: true }
                },
                likes: currentUserId ? { 
                    where: {
                        usuario_id: currentUserId 
                    },
                    select: {
                        usuario_id: true 
                    }
                } : false 
            },
            
            orderBy: orderBy,
            take,
            skip,
        });
        const ideasWithLikeStatus = ideas.map(idea => ({
            ...idea,
            isLikedByMe: currentUserId !== null && idea.likes && idea.likes.length > 0
        }));
        res.status(200).json(ideasWithLikeStatus);
    } catch (error) {
        console.error('Error fetching public ideas:', error);
        res.status(500).json({ error: 'Failed to retrieve public ideas.' });
    }
});

router.get('/private',authenticateToken, async (req, res) => {
    const { limit, offset, sort } = req.query;
    const take = parseInt(limit, 10) || undefined;
    const skip = parseInt(offset, 10) || undefined;

     let orderBy = { fecha_creacion: 'desc' };
    if (sort === 'date_asc') {
        orderBy = { fecha_creacion: 'asc' };
    }
    try {
          const ideas = await prisma.idea.findMany({
            where: {
                is_public: false,
                visible: true,
            },
            include: {
                autor: {
                    select: { usu_id: true, nombre: true }
                },
            },
            orderBy: orderBy,
            take,
            skip,
        });
        res.status(200).json(ideas);
    } catch (error) {
        console.error('Error fetching private ideas:', error);
        res.status(500).json({ error: 'Failed to retrieve private ideas.' });
    }
});

router.delete('/:ideaId', authenticateToken, async (req, res) => {
    const ideaId = parseInt(req.params.ideaId, 10);
    const autorId = req.user.usu_id;

    try {
        const idea = await prisma.idea.findUnique({
            where: { idea_id: ideaId },
            select: { autor_id: true },
        });

        if (!idea) {
            return res.status(404).json({ error: 'Idea not found.' });
        }

        if (idea.autor_id !== autorId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to delete this idea.' });
        }

        await prisma.idea.delete({
            where: { idea_id: ideaId },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting idea:', error);
        res.status(500).json({ error: 'Failed to delete idea.' });
    }
});

//likes
router.post('/:ideaId/likes', authenticateToken, async (req, res) => {
    const ideaId = parseInt(req.params.ideaId, 10);
    const userId = req.user.usu_id;
    try {
        const idea = await prisma.idea.findUnique({
            where: { idea_id: ideaId },
            select: { is_public: true, visible: true },
        });

        if (!idea || !idea.is_public || !idea.visible) {
            return res.status(404).json({ error: 'Idea not found or not public/visible.' });
        }
        const newLike = await prisma.likeIdea.create({
            data: {
                idea: { connect: { idea_id: ideaId } },
                usuario: { connect: { usu_id: userId } },
            },
        });
        res.status(201).json(newLike);
    } catch (error) {
        if (error.code === 'P2002') { 
            return res.status(400).json({ error: 'You have already liked this idea.' });
        }
        console.error('Error giving like:', error);
        res.status(500).json({ error: 'Failed to give like.' });
    }
});

router.delete('/:ideaId/likes',authenticateToken, async (req, res) => {
    const ideaId = parseInt(req.params.ideaId, 10);
    const userId = req.user.usu_id;

    try {
        const result = await prisma.likeIdea.deleteMany({
            where: {
                idea_id: ideaId,
                usuario_id: userId,
            },
        });

        if (result.count === 0) {
            return res.status(404).json({ error: 'Like not found or you have not liked this idea.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ error: 'Failed to remove like.' });
    }
});

//comments
router.post('/:ideaId/comments',authenticateToken, async (req, res) => {
    const ideaId = parseInt(req.params.ideaId, 10);
    const autorId = req.user.usu_id;
    const { contenido } = req.body;
    if (!contenido) {
        return res.status(400).json({ error: 'Comment content is required.' });
    }
    try {
        const idea = await prisma.idea.findUnique({
            where: { idea_id: ideaId },
            select: { is_public: true, visible: true },
        });
        if (!idea || !idea.is_public || !idea.visible) {
            return res.status(404).json({ error: 'Idea not found or not public/visible for comments.' });
        }
        const newComment = await prisma.comentarioIdea.create({
            data: {
                contenido,
                idea: { connect: { idea_id: ideaId } },
                autor: { connect: { usu_id: autorId } },
            },
            include: {
                autor: { select: { usu_id: true, nombre: true } } 
            }
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to leave comment.' });
    }
});

router.get('/:ideaId/comments', async (req, res) => {
    const ideaId = parseInt(req.params.ideaId, 10);
    try {
        const idea = await prisma.idea.findUnique({
            where: { idea_id: ideaId },
            select: { is_public: true, visible: true },
        });
        if (!idea || !idea.is_public || !idea.visible) {
            return res.status(404).json({ error: 'Idea not found or not public/visible for comments.' });
        }
        const comments = await prisma.comentarioIdea.findMany({
            where: {
                idea_id: ideaId,
                visible: true,
            },
            include: {
                autor: {
                    select: { usu_id: true, nombre: true } 
                }
            },
            orderBy: { fecha_creacion: 'asc' } 
        });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to retrieve comments.' });
    }
});

router.delete('/comments/:commentId', authenticateToken,  async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10);
    const autorId = req.user.usu_id;
    try {
        const comment = await prisma.comentarioIdea.findUnique({
            where: { comentario_id: commentId },
            select: { autor_id: true },
        });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }
        if (comment.autor_id !== autorId /* && !req.user.isAdmin */) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
        }
        await prisma.comentarioIdea.delete({
            where: { comentario_id: commentId },
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment.' });
    }
});

router.patch('/:ideaId/status', async (req, res) => {
    const ideaId = parseInt(req.params.ideaId, 10);
    const EstadoIdea = {
        Recibida: 'Recibida',
        EnRevision: 'EnRevision',
        Aprobada: 'Aprobada',
        Rechazada: 'Rechazada',
        Implementada: 'Implementada',
    };
    const { newStatus } = req.body; 
    if (!Object.values(EstadoIdea).includes(newStatus)) {
        return res.status(400).json({ error: 'Invalid status provided.' });
    }
    try {
        const updatedIdea = await prisma.idea.update({
            where: { idea_id: ideaId },
            data: {
                estado: newStatus,
                fecha_modificacion: new Date(),
            },
        });
        res.status(200).json(updatedIdea);
    } catch (error) {
        console.error('Error updating idea status:', error);
        res.status(500).json({ error: 'Failed to update idea status.' });
    }
});

//put to update the idea
router.patch('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; 
    const { titulo, contenido, is_public } = req.body;
    if (titulo === undefined && contenido === undefined && is_public === undefined) {
        return res.status(400).json({ error: 'Al menos un campo (titulo, contenido, o is_public) es requerido para la actualización.' });
    }
    try {
        const updateData = {};
        if (titulo !== undefined) {
            if (typeof titulo !== 'string' || titulo.trim() === '') {
                return res.status(400).json({ error: 'El título no puede estar vacío.' });
            }
            updateData.titulo = titulo;
        }
        if (contenido !== undefined) {
            if (typeof contenido !== 'string' || contenido.trim() === '') {
                return res.status(400).json({ error: 'El contenido no puede estar vacío.' });
            }
            updateData.contenido = contenido;
        }
        if (is_public !== undefined) {
            if (typeof is_public === 'string') {
                updateData.is_public = (is_public.toLowerCase() === 'true');
            } else if (typeof is_public === 'boolean') {
                updateData.is_public = is_public;
            } else {
                return res.status(400).json({ error: 'El campo is_public debe ser un booleano (true/false).' });
            }
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No se encontraron campos válidos para actualizar.' });
        }
        const existingIdea = await prisma.idea.findUnique({
            where: { idea_id: parseInt(id) },
            select: { is_public: true, titulo: true }
        });

        if (!existingIdea) {
            return res.status(404).json({ message: `Propuesta con ID ${id} no encontrada.` });
        }
        const updatedIdea = await prisma.idea.update({
            where: { idea_id: parseInt(id) },
            data: updateData,
        });

        res.status(200).json(updatedIdea); 
    } catch (error) {
        console.error(`Error updating idea ${id}:`, error);
        if (error.code === 'P2025') { 
            return res.status(404).json({ message: `Propuesta con ID ${id} no encontrada.` });
        }
        res.status(500).json({ message: 'Error al actualizar la propuesta.', error: error.message });
    }
});

export default router;