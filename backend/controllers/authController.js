const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const uploadToCloudinary = require('../services/cloudinaryService');

exports.signup = async (req, res) => {
  const { name, email, password, securityQuestion, securityAnswer } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    username: email.split('@')[0] + '_' + Date.now(), // Fallback to satisfy legacy unique db index
    securityQuestion: securityQuestion || "What is your mother's maiden name?",
    securityAnswer: securityAnswer ? securityAnswer.toLowerCase().trim() : "default_answer"
  });

  res.json({
    _id: user._id,
    token: generateToken(user._id)
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  res.json({
    _id: user._id,
    token: generateToken(user._id)
  });
};

exports.getSecurityQuestion = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ message: "No account found with this email" });
  }

  res.json({ securityQuestion: user.securityQuestion });
};

exports.resetPassword = async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Account not found" });

  if (user.securityAnswer !== securityAnswer.toLowerCase().trim()) {
    return res.status(400).json({ message: "Security answer is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: "Password reset completely successfully!" });
};

exports.updateProfilePin = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.profilePin = req.body.pin || "";
    await user.save();
    res.json({ message: "Portfolio PIN updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password -securityAnswer');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    if (req.file) {
      const { url } = await uploadToCloudinary(req.file);
      user.profilePic = url;
    }

    await user.save();
    
    // Return updated fields to frontend
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};