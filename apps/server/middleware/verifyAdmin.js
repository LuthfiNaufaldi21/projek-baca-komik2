const jwt = require("jsonwebtoken");

// Middleware untuk verifikasi admin
const verifyAdmin = (req, res, next) => {
  // Pastikan user sudah terautentikasi (dari middleware auth)
  if (!req.user) {
    return res
      .status(401)
      .json({ msg: "Akses ditolak. Tidak ada token otentikasi." });
  }

  // Cek apakah user memiliki role admin
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        msg: "Akses ditolak. Hanya admin yang dapat mengakses endpoint ini.",
      });
  }

  // Lanjutkan ke route berikutnya
  next();
};

module.exports = verifyAdmin;
