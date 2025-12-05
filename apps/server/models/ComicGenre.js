const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ComicGenre = sequelize.define(
  "ComicGenre",
  {
    comic_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "comics",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    genre_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "genres",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "comic_genres",
    timestamps: false,
  }
);

module.exports = ComicGenre;
