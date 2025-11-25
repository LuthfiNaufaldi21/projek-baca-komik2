const express = require('express');
const auth = require('../middleware/auth');
const { getProfile, toggleBookmark, updateHistory, uploadAvatar, updateProfile, updatePassword } = require('../controllers/userController'); // 👈 Import updatePassword

const router = express.Router();

// Route dasar
router.get('/profile', auth, getProfile); 
router.post('/bookmark', auth, toggleBookmark); 
router.post('/history', auth, updateHistory); 
router.put('/avatar', auth, uploadAvatar); 
router.put('/profile', auth, updateProfile); 

// 🎯 ROUTE BARU: Update Password
router.put('/password', auth, updatePassword); 

module.exports = router;