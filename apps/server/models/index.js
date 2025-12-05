const { sequelize } = require("../config/db");

// Import all models
const User = require("./User");
const Comic = require("./Comic");
const Genre = require("./Genre");
const ComicGenre = require("./ComicGenre");
const Bookmark = require("./Bookmark");
const ReadHistory = require("./ReadHistory");
const ReadChapter = require("./ReadChapter");

// Define associations
const initializeAssociations = () => {
  // User <-> Bookmark <-> Comic
  User.hasMany(Bookmark, { foreignKey: "user_id", as: "bookmarks" });
  Bookmark.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Comic.hasMany(Bookmark, { foreignKey: "comic_id", as: "bookmarks" });
  Bookmark.belongsTo(Comic, { foreignKey: "comic_id", as: "comic" });

  // User <-> ReadHistory <-> Comic (last chapter per comic)
  User.hasMany(ReadHistory, { foreignKey: "user_id", as: "readHistory" });
  ReadHistory.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Comic.hasMany(ReadHistory, { foreignKey: "comic_id", as: "readHistory" });
  ReadHistory.belongsTo(Comic, { foreignKey: "comic_id", as: "comic" });

  // User <-> ReadChapter <-> Comic (all chapters read)
  User.hasMany(ReadChapter, { foreignKey: "user_id", as: "readChapters" });
  ReadChapter.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Comic.hasMany(ReadChapter, { foreignKey: "comic_id", as: "readChapters" });
  ReadChapter.belongsTo(Comic, { foreignKey: "comic_id", as: "comic" });

  // Comic <-> Genre (Many-to-Many via ComicGenre)
  Comic.belongsToMany(Genre, {
    through: ComicGenre,
    foreignKey: "comic_id",
    otherKey: "genre_id",
    as: "genres",
  });

  Genre.belongsToMany(Comic, {
    through: ComicGenre,
    foreignKey: "genre_id",
    otherKey: "comic_id",
    as: "comics",
  });

  console.log("✅ Model associations initialized successfully.");
};

module.exports = {
  sequelize,
  User,
  Comic,
  Genre,
  ComicGenre,
  Bookmark,
  ReadHistory,
  ReadChapter,
  initializeAssociations,
};
