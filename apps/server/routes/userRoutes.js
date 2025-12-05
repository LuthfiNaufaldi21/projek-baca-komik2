const express = require("express");
const auth = require("../middleware/auth");
const {
  getProfile,
  toggleBookmark,
  updateHistory,
  uploadAvatar,
  updateProfile,
  updatePassword,
  deleteAccount,
  removeAvatar,
  markChapterRead,
  getReadChapters,
} = require("../controllers/userController");

const router = express.Router();

// Route dasar
router.get("/profile", auth, getProfile);
router.post("/bookmark", auth, toggleBookmark);
router.post("/history", auth, updateHistory);
router.put("/avatar", auth, uploadAvatar);
router.put("/profile", auth, updateProfile);

// 🎯 ROUTE BARU: Update Password
router.put("/password", auth, updatePassword);

// 🎯 ROUTE BARU: Delete Account & Remove Avatar
router.delete("/account", auth, deleteAccount);
router.delete("/avatar", auth, removeAvatar);

// 🎯 ROUTE BARU: Read Chapters (untuk DetailPage checkmarks)
router.post("/read-chapters", auth, markChapterRead); // Mark chapter as read
router.get("/read-chapters/:comicSlug", auth, getReadChapters); // Get all read chapters for a comic

module.exports = router;
