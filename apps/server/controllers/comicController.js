const { Comic, Genre, ComicGenre } = require("../models");

// Controller untuk membuat komik baru (Admin Only)
const createComic = async (req, res) => {
  try {
    const {
      slug,
      title,
      alternative_title,
      author,
      status,
      cover_url,
      synopsis,
      rating,
      type,
      genres, // Array of genre slugs atau IDs
    } = req.body;

    // Validasi input wajib
    if (!slug || !title) {
      return res.status(400).json({
        msg: "Slug dan Title wajib diisi.",
      });
    }

    // Cek apakah slug sudah ada
    const existingComic = await Comic.findOne({ where: { slug } });
    if (existingComic) {
      return res.status(400).json({
        msg: `Komik dengan slug "${slug}" sudah ada.`,
      });
    }

    // Buat komik baru
    const newComic = await Comic.create({
      slug,
      title,
      alternative_title: alternative_title || null,
      author: author || null,
      status: status || null,
      cover_url: cover_url || null,
      synopsis: synopsis || null,
      rating: rating || 0,
      type: type || null,
    });

    // Tambahkan relasi genre jika ada
    if (genres && Array.isArray(genres) && genres.length > 0) {
      for (const genreIdentifier of genres) {
        // Cari genre berdasarkan slug atau ID
        const genre = await Genre.findOne({
          where: {
            [isNaN(genreIdentifier) ? "slug" : "id"]: genreIdentifier,
          },
        });

        if (genre) {
          await ComicGenre.create({
            comic_id: newComic.id,
            genre_id: genre.id,
          });
        } else {
          console.warn(`⚠️  Genre "${genreIdentifier}" tidak ditemukan`);
        }
      }
    }

    // Fetch comic dengan genres untuk response
    const comicWithGenres = await Comic.findByPk(newComic.id, {
      include: [
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "name", "slug"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(201).json({
      msg: "Komik berhasil dibuat.",
      comic: comicWithGenres,
    });
  } catch (err) {
    console.error("Error creating comic:", err);
    res.status(500).json({
      msg: "Server Error: Gagal membuat komik.",
      detail: err.message,
    });
  }
};

// Controller untuk mengupdate komik (Admin Only)
const updateComic = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title,
      alternative_title,
      author,
      status,
      cover_url,
      synopsis,
      rating,
      type,
      genres,
    } = req.body;

    const comic = await Comic.findOne({ where: { slug } });

    if (!comic) {
      return res.status(404).json({
        msg: `Komik dengan slug "${slug}" tidak ditemukan.`,
      });
    }

    // Update fields
    if (title) comic.title = title;
    if (alternative_title !== undefined)
      comic.alternative_title = alternative_title;
    if (author !== undefined) comic.author = author;
    if (status !== undefined) comic.status = status;
    if (cover_url !== undefined) comic.cover_url = cover_url;
    if (synopsis !== undefined) comic.synopsis = synopsis;
    if (rating !== undefined) comic.rating = rating;
    if (type !== undefined) comic.type = type;

    await comic.save();

    // Update genres jika ada
    if (genres && Array.isArray(genres)) {
      // Hapus relasi lama
      await ComicGenre.destroy({ where: { comic_id: comic.id } });

      // Tambah relasi baru
      for (const genreIdentifier of genres) {
        const genre = await Genre.findOne({
          where: {
            [isNaN(genreIdentifier) ? "slug" : "id"]: genreIdentifier,
          },
        });

        if (genre) {
          await ComicGenre.create({
            comic_id: comic.id,
            genre_id: genre.id,
          });
        }
      }
    }

    // Fetch updated comic dengan genres
    const updatedComic = await Comic.findByPk(comic.id, {
      include: [
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "name", "slug"],
          through: { attributes: [] },
        },
      ],
    });

    res.json({
      msg: "Komik berhasil diupdate.",
      comic: updatedComic,
    });
  } catch (err) {
    console.error("Error updating comic:", err);
    res.status(500).json({
      msg: "Server Error: Gagal mengupdate komik.",
      detail: err.message,
    });
  }
};

// Controller untuk menghapus komik (Admin Only)
const deleteComic = async (req, res) => {
  try {
    const { slug } = req.params;

    const comic = await Comic.findOne({ where: { slug } });

    if (!comic) {
      return res.status(404).json({
        msg: `Komik dengan slug "${slug}" tidak ditemukan.`,
      });
    }

    await comic.destroy();

    res.json({
      msg: `Komik "${comic.title}" berhasil dihapus.`,
    });
  } catch (err) {
    console.error("Error deleting comic:", err);
    res.status(500).json({
      msg: "Server Error: Gagal menghapus komik.",
      detail: err.message,
    });
  }
};

// Controller untuk mendapatkan semua komik (Public)
const getAllComics = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search, sort, genre } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};
    const includeClause = [
      {
        model: Genre,
        as: "genres",
        attributes: ["id", "name", "slug"],
        through: { attributes: [] },
      },
    ];

    // Filter by type (manga, manhwa, manhua)
    if (type) {
      whereClause.type = type;
    }

    // Search by title
    if (search) {
      whereClause.title = {
        [require("sequelize").Op.iLike]: `%${search}%`,
      };
    }

    // Filter by genre
    if (genre) {
      // Genre slug should match: "Slice of Life" -> "slice-of-life"
      // But API receives: "Slice of Life" (with spaces)
      // Convert to slug format: lowercase + replace spaces with dashes
      const genreSlug = genre.toLowerCase().trim().replace(/\s+/g, "-");

      includeClause[0].where = {
        [require("sequelize").Op.or]: [
          { slug: genreSlug }, // "slice-of-life"
          { name: { [require("sequelize").Op.iLike]: genre } }, // Fallback: case-insensitive name match
        ],
      };
      includeClause[0].required = true;
    }

    // Determine sort order
    let orderClause;
    if (sort === "rating") {
      orderClause = [["rating", "DESC"]];
    } else if (sort === "created_at") {
      orderClause = [["created_at", "DESC"]];
    } else {
      orderClause = [["created_at", "DESC"]]; // default
    }

    const { count, rows } = await Comic.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause,
      distinct: true,
    });

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching comics:", err);
    res.status(500).json({
      msg: "Server Error: Gagal mengambil daftar komik.",
      detail: err.message,
    });
  }
};

module.exports = {
  createComic,
  updateComic,
  deleteComic,
  getAllComics,
};
