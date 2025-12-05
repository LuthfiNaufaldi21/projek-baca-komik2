const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Bookmark = sequelize.define(
  "Bookmark",
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
  },
  {
    tableName: "bookmarks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "comic_id"],
        name: "unique_user_bookmark",
      },
    ],
  }
);

module.exports = Bookmark;
