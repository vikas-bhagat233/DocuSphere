const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
  securityQuestion: {
    type: String,
    required: true,
    default: "What is your mother's maiden name?"
  },
  securityAnswer: {
    type: String,
    required: true,
    default: "default_answer"
  },
  profilePin: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);