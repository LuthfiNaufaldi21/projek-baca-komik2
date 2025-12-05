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

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connection has been established successfully.");

    // Initialize all models and associations
    const { initializeAssociations } = require("../models");
    initializeAssociations();

    // DO NOT use sync({ alter: true }) or { force: true } - tables already exist in Supabase
    // Sequelize is only for mapping models and queries
    console.log("✅ All models and associations initialized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
