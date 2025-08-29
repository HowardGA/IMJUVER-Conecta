import jwt from 'jsonwebtoken';

const optionalAuthenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const userPayload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = userPayload; 
        next(); 
    } catch (error) {
        console.error('Invalid token in optional auth, proceeding as unauthenticated:', error.message);
        req.user = null; 
        next(); 
    }
};

export default optionalAuthenticateToken;