import express from 'express';
import prisma from '../prismaClient.js';

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

export default router;