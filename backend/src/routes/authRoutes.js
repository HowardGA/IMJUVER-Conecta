import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../services/emailService.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { nombre, apellido, email, password, telefono, rol_id, fecha_nacimiento, nivel_educativo } = req.body;
    
    if (!nombre || !apellido || !email || !password || !telefono || !rol_id || !fecha_nacimiento) {
        return res.status(400).json({ message: 'Faltan datos obligatorios por llenar', status: 'error' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'El formato del email es inválido', status: 'error' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.', status: 'error' });
    }

    try {
        const existingUser = await prisma.usuarios.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado', status: 'error' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al verificar el usuario', status: 'error' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = uuidv4();

    try {
        await prisma.usuarios.create({
            data: {
                nombre,
                apellido,
                email,
                password: hashedPassword,
                rol_id: parseInt(rol_id),
                telefono,
                fecha_nacimiento: new Date(fecha_nacimiento),
                nivel_educativo: nivel_educativo || null, 
                estado: false, 
                fecha_creacion: new Date(),
                fecha_modificacion: new Date(),
                isVerified: false,
                verificationToken,
                verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
        });

        await sendVerificationEmail(email, verificationToken); 

          res.status(201).json({
            message: 'Usuario registrado con exito! Por favor verifique su correo',
            status: 'success',
          });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ 
            message: 'Error al registrar el usuario',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

//veryfy email
router.get('/verify-email/:token', async (req, res) => {
    const {token} = req.params;
    if (!token) {
        return res.status(400).json({message: 'Token no proporcionado'});
    }

    try{
        const user = await prisma.usuarios.findUnique({
            where: { verificationToken: token }
        });
        if (!user) {
            return res.status(400).json({message: 'Token inválido o expirado'});
        }
        if (user.verificationTokenExpires < new Date()) {
            return res.status(400).json({message: 'Token expirado'});
        }
        await prisma.usuarios.update({
            where: { usu_id: user.usu_id },
            data: {
                estado: true,
                isVerified: true,
                verificationToken: null,
                verificationTokenExpires: null
            }
        });
        return res.status(200).json({ status: 'success', message: 'Email verificado con éxito'});
    } catch (error) {
        console.error('Email verification error:', error);
        return res.status(500).json({ 
            message: 'Error al verificar el email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

//resend verification email
router.post('/resend-verification-email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email es requerido' });
    }

    try {
        const user = await prisma.usuarios.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.estado) {
            return res.status(400).json({ message: 'El usuario ya está verificado' });
        }

        const verificationToken = uuidv4();
        await prisma.usuarios.update({
            where: { usu_id: user.usu_id },
            data: { verificationToken }
        });

        await sendVerificationEmail(email, verificationToken);

        return res.status(200).json({ message: 'Email de verificación reenviado' });

    } catch (error) {
        console.error('Resend verification email error:', error);
        return res.status(500).json({ 
            message: 'Error al reenviar el email de verificación',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

//login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Email y contraseña son requeridos' 
        });
    }

    try {
        const user = await prisma.usuarios.findUnique({
            where: { email },
            include: {
                rol: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
              success: false,
              message: 'Por favor verifica tu email primero'
            });
        }

        if (!user.estado) {
            return res.status(403).json({ 
                success: false,
                message: 'Cuenta desactivada' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas' 
            });
        }

        const token = jwt.sign(
            { 
                usu_id: user.usu_id, 
                email: user.email, 
                rol_id: user.rol_id,
                rol_nombre: user.rol?.nombre 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userData = {
            usu_id: user.usu_id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            rol_id: user.rol_id,
            rol_nombre: user.rol?.nombre
        };

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', 
            path: '/',
            // domain: 'localhost',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error en el servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    console.log('Current user data from token:', req.user); 
    if (req.user) {
        try {
            const user = await prisma.usuarios.findUnique({
                where: { usu_id: req.user.usu_id }, 
                include: { rol: true }
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            const userData = {
                usu_id: user.usu_id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol_id: user.rol_id,
                rol_nombre: user.rol?.nombre
            };
            return res.json({ success: true, user: userData });
        } catch (error) {
            console.error('Error fetching user data for /me:', error);
            return res.status(500).json({ success: false, message: 'Error del servidor al consuldar los datos' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'No esta autenticado' });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        expires: new Date(0)
    });
    return res.json({ success: true, message: 'Sesión cerrada exitosamente' });
});

export default router;