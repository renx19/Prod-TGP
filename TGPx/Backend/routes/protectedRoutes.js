// routes/userRoutes.js
const express = require('express');
const {verifyRole } = require('../middleware/verifyRoleMw'); // Import the separated middleware
const router = express.Router();

// Public route
router.get('/', (req, res) => {
  res.json({ message: 'This is a public route.' });
});

// Protected route for admins
router.get('/admin', verifyRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// Protected route for members and admins
router.get('/member', verifyRole('member'), (req, res) => {
  res.json({ message: 'Welcome, member or admin!' });
});


module.exports = router;
