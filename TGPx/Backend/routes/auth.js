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
// const loginLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 5, // Limit each IP to 5 login requests per window
//     message: 'Too many login attempts, please try again later.',
// });

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

// Login Route no sensitive data
// router.post('/login', /*loginLimiter,*/ async(req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if the user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return sendResponse(res, 400, { success: false, message: 'Invalid credentials' });
//         }

//         // Compare password
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return sendResponse(res, 400, { success: false, message: 'Invalid credentials' });
//         }

//         // // Generate tokens
//         // const accessToken = jwt.sign({ id: user._id, username: user.username, role: user.role },
//         //     JWT_SECRET, { expiresIn: '15m' }
//         // );

//         // const refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role },
//         //     JWT_REFRESH_SECRET, { expiresIn: '7d' }
//         // );

//         const accessToken = jwt.sign({ id: user._id, username: user.username, role: user.role },
//             JWT_SECRET, { expiresIn: '1m' }
//         );

//         const refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role },
//             JWT_REFRESH_SECRET, { expiresIn: '2m' }
//         );

//         // Set tokens in cookies
//         res.cookie('accessToken', accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//             // maxAge: 15 * 60 * 1000 // 15 minutes
//             maxAge: 1 * 60 * 1000 // 1 minute
//         });

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//             // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//             maxAge: 1 * 60 * 1000 // 1 minute
//         });

//         // Fetch associated member details if the user is not an admin
//         let memberData = null;
//         if (user.role !== 'admin') {
//             memberData = await Member.findOne({ user: user._id });
//             if (!memberData) {
//                 return sendResponse(res, 404, { success: false, message: 'Member not found' });
//             }
//         }

//         // Return success response with user role and member data
//         return sendResponse(res, 200, { success: true, role: user.role, user, member: memberData });

//     } catch (error) {
//         console.error('Error during login:', error);
//         sendResponse(res, 500, { success: false, message: 'Server error' });
//     }
// });

// Login Route
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        // Generate minimal tokens
        // Generate tokens
        const accessToken = jwt.sign({ id: user._id, role: user.role },
            JWT_SECRET, { expiresIn: '15m' } // Standard: 15 minutes
        );

        const refreshToken = jwt.sign({ id: user._id },
            JWT_REFRESH_SECRET, { expiresIn: '7d' } // Standard: 7 days
        );

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in prod, false in dev
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({ success: true }); // Do not return full user info in cookies
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// Refresh Token Route
router.post('/refresh-token', async(req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.status(401).json({ success: false, message: 'No refresh token provided' });

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id).lean();
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const memberData = user.role !== 'admin' ? await Member.findOne({ user: user._id }).lean() : null;

        // Issue new access token
        const newAccessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1m' }); // 1 minute

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 1 * 60 * 1000
        });

        return res.json({
            success: true,
            user, // safe to return here since frontend requested it explicitly
            role: user.role,
            member: memberData
        });
    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }
});



// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    sendResponse(res, 200, { success: true });
});

module.exports = router;