// routes/authRoutes.js

const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Endpoint untuk Pendaftaran User Baru
router.post('/register', registerUser);

// Endpoint untuk Login User
router.post('/login', loginUser);

module.exports = router;