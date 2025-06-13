import prisma from '../prismaClient.js';
import express from 'express';

const router = express.Router();

//create a course category
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre && !descripcion) {
            return res.status(400).json({ message: 'El nombre y descripción son requeridos' });
        }

        const categoria = await prisma.categorias_Cursos.create({
            data: {
                nombre,
                descripcion,
                fecha_creacion: new Date(),
                fecha_modificacion: new Date(),
            }
        });

        res.status(201).json({ message: 'Categoria creada exitosamente', categoria });

    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la categoria' });
    }
});

//get all course categories
router.get('/', async (req, res) => {
    try {
        const categorias = await prisma.categorias_Cursos.findMany();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorias' });
    }
});

export default router;