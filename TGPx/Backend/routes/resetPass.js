const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/users'); // Adjust the path to your User model

const router = express.Router();

// Utility function to send consistent JSON responses
const sendResponse = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.GMAIL_USER, // Your email
    pass: process.env.GMAIL_PASS, // Your email password or app password
  },
});

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
};

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, { message: 'User not found' });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save the reset token and expiration time in the user's document
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Construct the password reset URL
    const resetUrl = `${process.env.FRONTEND_URL}#/reset-password/${resetToken}`;

    // Send email with the reset link
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    sendResponse(res, 200, { message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    console.error('Error during forgot password operation:', error);
    sendResponse(res, 500, { message: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Validate the new password
  if (!validatePassword(newPassword)) {
    return sendResponse(res, 400, { message: 'Password must be at least 8 characters long, and include upper case, lower case, numbers, and special characters.' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Ensure the token is still valid
    });

    if (!user) {
      return sendResponse(res, 400, { message: 'Invalid or expired token.' });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the reset token and its expiration time
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();
    sendResponse(res, 200, { message: 'Your password has been reset successfully.' });
  } catch (error) {
    console.error('Error during password reset operation:', error);
    sendResponse(res, 500, { message: 'An error occurred while resetting your password. Please try again later.' });
  }
});

module.exports = router; // Export the router for use in your server
