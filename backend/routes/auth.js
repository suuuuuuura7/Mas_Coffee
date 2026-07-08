import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: 'Invalid username or password.' });

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid username or password.' });

        const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie('token', token, COOKIE_OPTIONS);
        res.json({ message: 'Logged in successfully.', username: admin.username });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', COOKIE_OPTIONS);
    res.json({ message: 'Logged out.' });
});

// GET /api/auth/me - lets the frontend check if the current cookie is still valid
router.get('/me', requireAuth, (req, res) => {
    res.json({ username: req.admin.username });
});

// POST /api/auth/change-password - requires being logged in already
router.post('/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        }
        const admin = await Admin.findById(req.admin.id);
        const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

        admin.passwordHash = await bcrypt.hash(newPassword, 10);
        await admin.save();
        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;