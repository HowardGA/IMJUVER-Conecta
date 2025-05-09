import express from 'express';
import prisma from '../prismaClient.js';

const router = express.Router();

//Get all roles 
router.get('/', async (req, res) =>{
    try {
        const roles = await prisma.roles.findMany();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los roles' });
    }
});

//Create a new role
router.post('/', async (req, res) => {
    try {
        const {nombre, descripcion} = req.body;
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del rol es requerido' });
        }
        const newRole = await prisma.roles.create({
            data: {
                nombre,
                descripcion,
                fecha_creacion: new Date(),
                fecha_modificacion: new Date()
            }
        });
        res.status(201).json({
            message: 'Rol creado con éxito',
            role: newRole
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el rol' });
    }
});

//Update a role
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {nombre, descripcion} = req.body;
    try {
        const updatedRole = await prisma.roles.update({
            where: { rol_id: parseInt(id)},
            data: {
                nombre,
                descripcion,
                fecha_modificacion: new Date()
            }
        });

        res.status(200).json({
            message: 'Rol actualizado con éxito',
            role: updatedRole
        });
    }catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol'});
    }
});

//Delete a role
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const deleteRole = await prisma.roles.delete({
            where: {role_id: parseInt(id)}
        });
        res.status(200).json({
            message: 'Rol eliminado con éxito',
            role: deleteRole
        });
    }catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol'});
    }
});

export default router;