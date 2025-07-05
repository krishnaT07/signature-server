const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// ✍️ POST /api/auth/register - Register new user
router.post('/register', register);

// 🔐 POST /api/auth/login - Login user and return token
router.post('/login', login);

module.exports = router;
