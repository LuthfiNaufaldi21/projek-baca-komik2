const {
  User,
  Comic,
  Bookmark,
  ReadHistory,
  ReadChapter,
  Genre,
} = require("../models");
const { sequelize } = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

// --- KONFIGURASI MULTER ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/uploads/avatars");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`);
  },
});

const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Hanya file gambar JPG/JPEG atau PNG yang diizinkan!"), false);
  },
}).single("avatar");

// --- CONTROLLER LOGIC UTAMA ---

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Bookmark,
          as: "bookmarks",
          include: [
            {
              model: Comic,
              as: "comic",
              attributes: [
                "id",
                "slug",
                "title",
                "cover_url",
                "author",
                "status",
                "type",
                "rating",
              ],
              include: [
                {
                  model: Genre,
                  as: "genres",
                  attributes: ["id", "name", "slug"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
        {
          model: ReadHistory,
          as: "readHistory",
          include: [
            {
              model: Comic,
              as: "comic",
              attributes: [
                "id",
                "slug",
                "title",
                "cover_url",
                "author",
                "status",
                "type",
                "rating",
              ],
              include: [
                {
                  model: Genre,
                  as: "genres",
                  attributes: ["id", "name", "slug"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
          order: [["read_at", "DESC"]],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

const toggleBookmark = async (req, res) => {
  const { comicSlug } = req.body;
  const userId = req.user.id;

  if (!comicSlug) {
    return res.status(400).json({ msg: "comicSlug wajib diisi." });
  }

  const transaction = await sequelize.transaction();

  try {
    // Cari comic berdasarkan slug
    const comic = await Comic.findOne({
      where: { slug: comicSlug },
      transaction,
    });
    if (!comic) {
      await transaction.rollback();
      return res.status(404).json({ msg: "Komik tidak ditemukan." });
    }

    // Cek apakah sudah dibookmark
    const existingBookmark = await Bookmark.findOne({
      where: { user_id: userId, comic_id: comic.id },
      transaction,
    });

    let responseMsg = "";
    let isBookmarked = false;

    if (existingBookmark) {
      // Hapus bookmark
      await existingBookmark.destroy({ transaction });
      responseMsg = "Bookmark berhasil dihapus";
      isBookmarked = false;
    } else {
      // Tambah bookmark
      await Bookmark.create(
        {
          user_id: userId,
          comic_id: comic.id,
        },
        { transaction }
      );
      responseMsg = "Bookmark berhasil ditambahkan";
      isBookmarked = true;
    }

    await transaction.commit();

    res.json({
      msg: responseMsg,
      bookmarked: isBookmarked,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("CRITICAL DB ERROR during toggleBookmark:", err);
    res
      .status(500)
      .json({ msg: "Server Error: Gagal menyimpan data bookmark." });
  }
};

const updateHistory = async (req, res) => {
  const { comicSlug, chapterSlug } = req.body;
  const userId = req.user.id;

  if (!comicSlug || !chapterSlug) {
    return res
      .status(400)
      .json({ msg: "comicSlug dan chapterSlug wajib diisi." });
  }

  const transaction = await sequelize.transaction();

  try {
    // Cari comic berdasarkan slug
    const comic = await Comic.findOne({
      where: { slug: comicSlug },
      transaction,
    });
    if (!comic) {
      await transaction.rollback();
      return res.status(404).json({ msg: "Komik tidak ditemukan." });
    }

    // Upsert: update jika sudah ada, insert jika belum
    await ReadHistory.upsert(
      {
        user_id: userId,
        comic_id: comic.id,
        chapter_slug: chapterSlug,
        read_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    res.json({
      msg: `Riwayat bacaan untuk komik ${comicSlug} chapter ${chapterSlug} diperbarui.`,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("CRITICAL DB ERROR during updateReadingHistory:", err);
    res
      .status(500)
      .json({ msg: "Server Error: Gagal menyimpan riwayat bacaan." });
  }
};

const uploadAvatar = (req, res) => {
  req.userId = req.user.id;

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message || "Gagal mengunggah file." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload." });
    }

    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "User tidak ditemukan." });
      }

      const oldAvatarPath = user.avatar
        ? path.join(__dirname, "..", user.avatar)
        : null;
      const newAvatarPath = `/uploads/avatars/${req.file.filename}`;

      user.avatar = newAvatarPath;
      await user.save();

      if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }

      res.status(200).json({
        message: "Foto profil berhasil diunggah",
        avatar: newAvatarPath,
      });
    } catch (error) {
      console.error(error);
      fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Gagal memperbarui foto profil." });
    }
  });
};

const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.id;

  if (!username && !email) {
    return res.status(400).json({
      msg: "Setidaknya satu field (username atau email) harus diisi.",
    });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }

    // 1. Cek duplikasi Email/Username (hanya jika field diubah)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res
          .status(400)
          .json({ msg: "Email sudah digunakan oleh user lain." });
      }
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) {
        return res
          .status(400)
          .json({ msg: "Username sudah digunakan oleh user lain." });
      }
    }

    // 2. Lakukan Update (tanpa bio)
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    // 3. Kirim kembali data profil yang diperbarui (tanpa password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      msg: "Profil berhasil diperbarui.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("CRITICAL DB ERROR during updateProfile:", err.message);
    res.status(500).json({ msg: "Server Error: Gagal menyimpan profil." });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ msg: "Password lama dan baru wajib diisi." });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }

    // 1. Verifikasi Password Lama
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password lama tidak cocok." });
    }

    // 2. Hash Password Baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Update Password di Database
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password berhasil diperbarui." });
  } catch (err) {
    console.error("CRITICAL DB ERROR during updatePassword:", err.message);
    res.status(500).json({ msg: "Server Error: Gagal mengganti password." });
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }

    // Hapus file avatar jika ada
    if (user.avatar) {
      const avatarPath = path.join(__dirname, "../public", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Hapus user dari database
    await user.destroy();

    res.json({ msg: "Akun berhasil dihapus." });
  } catch (err) {
    console.error("CRITICAL DB ERROR during deleteAccount:", err.message);
    res.status(500).json({ msg: "Server Error: Gagal menghapus akun." });
  }
};

const removeAvatar = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan." });
    }

    // Hapus file avatar jika ada
    if (user.avatar) {
      const avatarPath = path.join(__dirname, "../public", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Set avatar ke null
    user.avatar = null;
    await user.save();

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      msg: "Avatar berhasil dihapus.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("CRITICAL DB ERROR during removeAvatar:", err.message);
    res.status(500).json({ msg: "Server Error: Gagal menghapus avatar." });
  }
};

// Mark chapter as read (for DetailPage checkmarks)
const markChapterRead = async (req, res) => {
  const { comicSlug, chapterSlug } = req.body;
  const userId = req.user.id;

  if (!comicSlug || !chapterSlug) {
    return res
      .status(400)
      .json({ msg: "comicSlug dan chapterSlug wajib diisi." });
  }

  const transaction = await sequelize.transaction();

  try {
    // Find comic
    const comic = await Comic.findOne({
      where: { slug: comicSlug },
      transaction,
    });
    if (!comic) {
      await transaction.rollback();
      return res.status(404).json({ msg: "Komik tidak ditemukan." });
    }

    // Insert or ignore if already exists
    await ReadChapter.findOrCreate({
      where: {
        user_id: userId,
        comic_id: comic.id,
        chapter_slug: chapterSlug,
      },
      defaults: {
        user_id: userId,
        comic_id: comic.id,
        chapter_slug: chapterSlug,
        read_at: new Date(),
      },
      transaction,
    });

    await transaction.commit();

    res.json({
      msg: `Chapter ${chapterSlug} ditandai sudah dibaca.`,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("CRITICAL DB ERROR during markChapterRead:", err);
    res
      .status(500)
      .json({ msg: "Server Error: Gagal menyimpan chapter yang dibaca." });
  }
};

// Get all read chapters for a comic (for DetailPage)
const getReadChapters = async (req, res) => {
  const { comicSlug } = req.params;
  const userId = req.user.id;

  try {
    // Find comic
    const comic = await Comic.findOne({ where: { slug: comicSlug } });
    if (!comic) {
      return res.status(404).json({ msg: "Komik tidak ditemukan." });
    }

    // Get all read chapters for this comic
    const readChapters = await ReadChapter.findAll({
      where: {
        user_id: userId,
        comic_id: comic.id,
      },
      attributes: ["chapter_slug", "read_at"],
      order: [["read_at", "DESC"]],
    });

    res.json({
      comicSlug,
      chapters: readChapters.map((ch) => ch.chapter_slug),
    });
  } catch (err) {
    console.error("ERROR fetching read chapters:", err);
    res
      .status(500)
      .json({ msg: "Server Error: Gagal mengambil data chapter." });
  }
};

module.exports = {
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
};
