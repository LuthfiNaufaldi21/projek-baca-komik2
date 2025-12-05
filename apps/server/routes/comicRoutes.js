const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  createComic,
  updateComic,
  deleteComic,
  getAllComics,
} = require("../controllers/comicController");

// Public routes
router.get("/", getAllComics);

// Admin-only routes (require auth + admin role)
router.post("/", auth, verifyAdmin, createComic);
router.put("/:slug", auth, verifyAdmin, updateComic);
router.delete("/:slug", auth, verifyAdmin, deleteComic);

module.exports = router;
