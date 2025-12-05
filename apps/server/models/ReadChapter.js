const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ReadChapter = sequelize.define(
  "ReadChapter",
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
    tableName: "read_chapters",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "comic_id", "chapter_slug"],
        name: "unique_user_chapter",
      },
      {
        fields: ["user_id", "comic_id"],
        name: "idx_read_chapters_user_comic",
      },
    ],
  }
);

module.exports = ReadChapter;
