const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  resetToken: { type: String, default: null }, // Nullable reset token
  resetTokenExpiration: { type: Date, default: null }, // Nullable expiration time
});

// Create a User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
 