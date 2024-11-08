const express = require('express');
const bcrypt = require('bcryptjs'); // instead of require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const Member = require('../models/members.js');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

// Helper function to send responses
const sendResponse = (res, status, data) => {
    return res.status(status).json(data);
};



// Rate limiter for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: 'Too many login attempts, please try again later.',
});

// Signup Route
router.post('/signup', async(req, res) => {
    const { username, email, password, role = 'member' } = req.body; // Default to 'member' if no role is provided

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, { message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });

        await newUser.save();
        sendResponse(res, 201, { message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        sendResponse(res, 500, { message: 'Error creating user', error });
    }
});

// Login Route
router.post('/login', loginLimiter, async(req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 400, { success: false, message: 'Invalid credentials' });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return sendResponse(res, 400, { success: false, message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = jwt.sign({ id: user._id, username: user.username, role: user.role },
            JWT_SECRET, { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role },
            JWT_REFRESH_SECRET, { expiresIn: '7d' }
        );

        // Set tokens in cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Fetch associated member details if the user is not an admin
        let memberData = null;
        if (user.role !== 'admin') {
            memberData = await Member.findOne({ user: user._id });
            if (!memberData) {
                return sendResponse(res, 404, { success: false, message: 'Member not found' });
            }
        }

        // Return success response with user role and member data
        return sendResponse(res, 200, { success: true, role: user.role, user, member: memberData });

    } catch (error) {
        console.error('Error during login:', error);
        sendResponse(res, 500, { success: false, message: 'Server error' });
    }
});

// Refresh Token Route
router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return sendResponse(res, 401, { success: false, message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return sendResponse(res, 403, { success: false, message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: decoded.id, username: decoded.username, role: decoded.role },
            JWT_SECRET, { expiresIn: '15m' } // 15 minutes
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        sendResponse(res, 200, { success: true });
    });
});

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    sendResponse(res, 200, { success: true });
});

module.exports = router;