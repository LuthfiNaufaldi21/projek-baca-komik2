const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Ambil token dari header
    // Biasanya formatnya: Authorization: Bearer <token>
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Cek jika token tidak ada
    if (!token) {
        // Status 401: Unauthorized (Tidak ada token)
        return res.status(401).json({ msg: 'Akses ditolak. Tidak ada token otentikasi.' });
    }

    try {
        // 3. Verifikasi Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Tambahkan user dari payload token ke objek request (req.user)
        // Kita bisa mengakses req.user.id di controller setelah ini
        req.user = decoded.user;
        
        // Lanjutkan ke route berikutnya
        next();

    } catch (err) {
        // Status 401: Token tidak valid (expired atau diubah)
        res.status(401).json({ msg: 'Token tidak valid atau kadaluarsa.' });
    }
};