import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../services/emailService.js';

const router = express.Router();

//Register a new user
router.post('/register', async (req, res) => {
    const { nombre, apellido, email, password, telefono, rol_id, fecha_nacimiento, nivel_educativo } = req.body;
    
    if (!nombre || !apellido || !email || !password || !telefono || !rol_id || !fecha_nacimiento) {
        return res.status(400).json({ message: 'Faltan datos obligatorios por llenar', status: 'error' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'El formato del email es inválido', status: 'error' });
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

    const hashedPassword = bcrypt.hashSync(password, 10); // Increased salt rounds to 10
    const verificationToken = uuidv4();

    try {
        const newUser = await prisma.usuarios.create({
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

        // Create a token
        const token = jwt.sign(
            { id: newUser.usu_id, email: newUser.email, rol_id: newUser.rol_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        await sendVerificationEmail(email, verificationToken);

        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
          });
          
          res.status(201).json({
            message: 'Usuario registrado con exito! Por favor verifique su email',
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
        return res.status(200).json({message: 'Email verificado con éxito'});
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
        // Find user with role information
        const user = await prisma.usuarios.findUnique({
            where: { email },
            include: {
                rol: true
            }
        });

        //check if that email exists
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

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas' 
            });
        }

        // Check if user is active
        if (!user.estado) {
            return res.status(403).json({ 
                success: false,
                message: 'Cuenta desactivada' 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: user.usu_id, 
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
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // res.header('Access-Control-Allow-Credentials', 'true');
        // res.header('Access-Control-Allow-Origin', 'http://localhost:5173');

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

export default router;