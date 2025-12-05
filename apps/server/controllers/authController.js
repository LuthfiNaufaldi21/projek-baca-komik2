// controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import model User (sudah terhubung ke Postgres)

// --- FUNGSI REGISTER USER BARU ---
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validasi Input
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Mohon isi semua field yang diperlukan" });
  }

  try {
    // 2. Cek apakah user sudah ada (Email atau Username)
    let userByEmail = await User.findOne({ where: { email } });
    if (userByEmail) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }

    let userByUsername = await User.findOne({ where: { username } });
    if (userByUsername) {
      return res.status(400).json({ msg: "Username sudah digunakan" });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Buat User Baru (dengan default role = 'user')
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role
    });

    // 5. Beri respons sukses
    res.status(201).json({
      msg: "Registrasi berhasil",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// --- FUNGSI LOGIN USER ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validasi Input
  if (!email || !password) {
    return res.status(400).json({ msg: "Mohon isi semua field" });
  }

  try {
    // 2. Cari User berdasarkan Email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Kredensial tidak valid" });
    }

    // 3. Bandingkan Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Kredensial tidak valid" });
    }

    // 4. Buat dan Kirim JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Menggunakan kunci rahasia dari .env
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
