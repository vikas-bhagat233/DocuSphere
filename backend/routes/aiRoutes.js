const express = require('express');
const router = express.Router();
const { chatWithDocuBot } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chatWithDocuBot);

module.exports = router;
