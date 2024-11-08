const User = require('../models/users'); // Your User model
const Member = require('../models/members'); // Your Member model

// Middleware to check if the user exists
const checkUser = async (req, res, next) => {
  const userId = req.params.userId || req.body.userId; // Get the user ID from params or body

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const userExists = await User.exists({ _id: userId }); // Check if user exists
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// Middleware to check if a member already exists for a user
const checkMember = async (req, res, next) => {
  const userId = req.body.userId; // Get the user ID from body

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const memberExists = await Member.exists({ user: userId }); // Check if member exists for this user
    if (memberExists) {
      return res.status(400).json({ error: 'User already has an associated member' });
    }
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error checking member:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// Export both middleware functions
module.exports = { checkUser, checkMember };
