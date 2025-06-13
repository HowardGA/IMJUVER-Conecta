import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token de autenticación.' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; 
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ message: 'Token de autenticación inválido o expirado.' });
    }
};

export default authenticateToken;
