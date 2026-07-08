import jwt from 'jsonwebtoken';

// Reads the JWT from the httpOnly cookie set at login. If it's missing or
// invalid, the request is rejected before it reaches the route handler.
export default function requireAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
}