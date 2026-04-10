import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        // Typical structure in user example uses 'user_id'
        req.user_id = decoded.user_id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};