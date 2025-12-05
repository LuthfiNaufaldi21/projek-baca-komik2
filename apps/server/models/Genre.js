const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Genre = sequelize.define(
  "Genre",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "genres",
    timestamps: false,
  }
);

module.exports = Genre;
