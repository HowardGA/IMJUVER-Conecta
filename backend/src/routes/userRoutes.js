import express from 'express';
import prisma from '../prismaClient.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userID', async (req, res) => {
    const {userID} = req.params;

    if(!userID){
        return res.status(400).json({message: 'ID de usuario no proporcionado'});
    }
    try{
        const user = await prisma.usuarios.findFirst({
            where: {usu_id: parseInt(userID)},
            select:{
                usu_id:true,
                nombre:true,
                apellido:true,
                email: true,
                rol_id:true,
                rol: {
                    select:{
                        nombre:true
                    }
                },
                fecha_nacimiento: true,
                telefono: true,
                nivel_educativo: true,
                estado: true,
                fecha_creacion: true,
                isVerified: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({ user,message: 'Información de usuario cargada' });
    }catch(error){
        return res.status(500).json({ 
            message: `Error al encontrar usuario ${userID}`,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/', async (req, res) => {
    try{
        const usuarios = await prisma.usuarios.findMany({
            select:{
                usu_id:true,
                nombre:true,
                apellido:true,
                email: true,
                rol_id:true,
                rol: {
                    select:{
                        nombre:true
                    }
                },
                fecha_nacimiento: true,
                telefono: true,
                nivel_educativo: true,
                estado: true,
                fecha_creacion: true,
                isVerified: true
            }
        });

        if(!usuarios){
            return res.status(404).json({message:'No existen usuarios registrados'});
        }

        return res.status(200).json({usuarios, message:'Información de usuarios cargada'})
    }catch (error){
         return res.status(500).json({ 
            message: `Error al regresar informacion de usuarios ${error}`,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/users/complete', async (req, res) => {
    try {
        const users = await prisma.usuarios.findMany({
            select: { 
                usu_id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                nivel_educativo: true,
                estado: true,
                isVerified: true,
                fecha_creacion: true,
                rol: { 
                    select: {
                        rol_id:true,
                        nombre: true, 
                        descripcion: true,
                    },
                },
            },
            orderBy: {
                fecha_creacion: 'desc',
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.', error: error.message });
    }
});

router.get('/admin/stats', async (req, res) => {
    try {
        const totalCourses = await prisma.cursos.count();
        const totalLessons = await prisma.lecciones.count();
        const totalPosts = await prisma.publicaciones.count();
        const totalQuizzes = await prisma.quizzes.count();
        const totalUsers = await prisma.usuarios.count();
        const totalCourseCategories = await prisma.categorias_Cursos.count();
        const totalModules = await prisma.modulos.count();

        res.status(200).json({
            totalCourses,
            totalLessons,
            totalPosts,
            totalQuizzes,
            totalUsers,
            totalCourseCategories,
            totalModules,
        });
    } catch (error) {
        console.error('Error fetching admin statistics:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener estadísticas de administración.', error: error.message });
    }
});

router.delete('/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'ID de usuario inválido.' });
    }
    try {
        const existingUser = await prisma.usuarios.findUnique({
            where: { usu_id: userId },
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        await prisma.usuarios.delete({
            where: { usu_id: userId },
        });
        res.status(200).json({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        if (error.code === 'P2003') {
             return res.status(409).json({ message: 'No se puede eliminar el usuario. Existen registros relacionados que deben ser eliminados primero o configurarse en cascada.', error: error.message });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al eliminar el usuario.', error: error.message });
    }
});

router.put('/users/:id/role', authenticateToken, async (req, res) => { 
    const { id } = req.params;
    const userId = parseInt(id);
    const { rol_id } = req.body; 
    if (isNaN(userId) || isNaN(rol_id)) {
        return res.status(400).json({ message: 'ID de usuario o ID de rol inválido.' });
    }

    try {
        const existingRole = await prisma.roles.findUnique({ where: { rol_id: rol_id } });
        if (!existingRole) {
            return res.status(400).json({ message: 'El ID de rol proporcionado no existe.' });
        }
        const updatedUser = await prisma.usuarios.update({
            where: { usu_id: userId },
            data: {
                rol_id: rol_id,
            },
            include: { rol: true }, 
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar rol.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar el rol del usuario.', error: error.message });
    }
});
export default router;