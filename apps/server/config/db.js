const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

// Fungsi untuk menginisialisasi semua model (Mencegah Circular Dependency)
const initializeModels = () => {
  require("../models/User");
  // Tambahkan model lain di sini jika ada
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connection has been established successfully.");

    // Inisialisasi Model sebelum Sinkronisasi
    initializeModels();

    // Sinkronisasi database (membuat table 'users' jika belum ada)
    // HAPUS { alter: true } untuk mencegah duplikasi constraint
    await sequelize.sync();
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
