const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ReadHistory = sequelize.define(
  "ReadHistory",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    comic_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "comics",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    chapter_slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "read_history",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "comic_id"], // Only 1 entry per user per comic
        name: "unique_user_comic_history",
      },
    ],
  }
);

module.exports = ReadHistory;
