const express = require('express');
const router = express.Router();
const { signup, login, getSecurityQuestion, resetPassword, updateProfilePin, getProfile, updateProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/get-security-question', getSecurityQuestion);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePic'), updateProfile);
router.put('/profile-pin', protect, updateProfilePin);

module.exports = router;