const User = require('../models/User'); 
const { sequelize } = require('../config/db'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// --- KONFIGURASI MULTER ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/avatars'); 
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${Date.now()}${ext}`); 
  }
});

const uploadMiddleware = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Hanya file gambar JPG/JPEG atau PNG yang diizinkan!"), false);
    }
}).single('avatar'); 

// --- CONTROLLER LOGIC UTAMA ---

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } 
        });

        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const toggleBookmark = async (req, res) => {
    const { comicId } = req.body;
    const userId = req.user.id; 

    if (!comicId) {
        return res.status(400).json({ msg: 'comicId wajib diisi.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ msg: 'User tidak ditemukan.' });
        }

        let bookmarks = user.bookmarks || [];
        
        const isBookmarked = bookmarks.some(b => b.comicId === comicId);
        let responseMsg = '';

        if (isBookmarked) {
            bookmarks = bookmarks.filter(b => b.comicId !== comicId);
            responseMsg = 'Bookmark berhasil dihapus';
        } else {
            bookmarks.push({ 
                comicId: comicId, 
                bookmarkedAt: new Date().toISOString()
            });
            responseMsg = 'Bookmark berhasil ditambahkan';
        }

        user.changed('bookmarks', true); 
        
        await user.update({ bookmarks: bookmarks }, { transaction });

        await transaction.commit();
        
        res.json({ 
            msg: responseMsg, 
            bookmarked: !isBookmarked,
            bookmarks: bookmarks 
        });

    } catch (err) {
        await transaction.rollback();
        console.error('CRITICAL DB ERROR during toggleBookmark:', err); 
        res.status(500).json({ msg: 'Server Error: Gagal menyimpan data bookmark.' });
    }
};

const updateHistory = async (req, res) => {
    const { comicId, chapterId } = req.body;
    const userId = req.user.id; 

    if (!comicId || !chapterId) {
        return res.status(400).json({ msg: 'comicId dan chapterId wajib diisi.' });
    }

    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ msg: 'User tidak ditemukan.' });
        }
        
        let history = user.readingHistory || [];

        history = history.filter(h => h.comicId !== comicId);
        
        history.push({ 
            comicId: comicId, 
            lastReadChapter: chapterId,
            readAt: new Date().toISOString()
        });

        user.changed('readingHistory', true); 
        
        await user.update({ readingHistory: history }, { transaction });

        await transaction.commit();
        
        res.json({ 
            msg: `Riwayat bacaan untuk komik ${comicId} bab ${chapterId} diperbarui.`, 
            readingHistory: history 
        });

    } catch (err) {
        await transaction.rollback();
        console.error('CRITICAL DB ERROR during updateReadingHistory:', err); 
        res.status(500).json({ msg: 'Server Error: Gagal menyimpan riwayat bacaan.' });
    }
};

const uploadAvatar = (req, res) => {
    req.userId = req.user.id; 
    
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || "Gagal mengunggah file." });
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

            const oldAvatarPath = user.avatar ? path.join(__dirname, '..', user.avatar) : null;
            const newAvatarPath = `/uploads/avatars/${req.file.filename}`;

            user.avatar = newAvatarPath;
            await user.save();

            if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }

            res.status(200).json({ 
                message: "Foto profil berhasil diunggah",
                avatar: newAvatarPath
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
        return res.status(400).json({ msg: 'Setidaknya satu field (username atau email) harus diisi.' });
    }

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan.' });
        }
        
        // 1. Cek duplikasi Email/Username (hanya jika field diubah)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ msg: 'Email sudah digunakan oleh user lain.' });
            }
        }
        
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ where: { username } });
            if (usernameExists) {
                return res.status(400).json({ msg: 'Username sudah digunakan oleh user lain.' });
            }
        }
        
        // 2. Lakukan Update
        user.username = username || user.username;
        user.email = email || user.email;
        
        await user.save();
        
        // 3. Kirim kembali data profil yang diperbarui (tanpa password)
        const updatedUser = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
        
        res.json({ 
            msg: 'Profil berhasil diperbarui.', 
            user: updatedUser
        });

    } catch (err) {
        console.error('CRITICAL DB ERROR during updateProfile:', err.message);
        res.status(500).json({ msg: 'Server Error: Gagal menyimpan profil.' });
    }
};

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; 

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ msg: 'Password lama dan baru wajib diisi.' });
    }
    
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan.' });
        }

        // 1. Verifikasi Password Lama
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Password lama tidak cocok.' });
        }

        // 2. Hash Password Baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update Password di Database
        user.password = hashedPassword;
        await user.save();
        
        res.json({ msg: 'Password berhasil diperbarui.' });

    } catch (err) {
        console.error('CRITICAL DB ERROR during updatePassword:', err.message);
        res.status(500).json({ msg: 'Server Error: Gagal mengganti password.' });
    }
};


module.exports = {
    getProfile,
    toggleBookmark,
    updateHistory,
    uploadAvatar,
    updateProfile,
    updatePassword
};