const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Comic = sequelize.define(
  "Comic",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alternative_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cover_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_sync_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "comics",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Comic;
