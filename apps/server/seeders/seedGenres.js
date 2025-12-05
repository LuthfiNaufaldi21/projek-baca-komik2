const { Genre } = require("../models");

const genres = [
  { name: "Action", slug: "action" },
  { name: "Adventure", slug: "adventure" },
  { name: "Comedy", slug: "comedy" },
  { name: "Dark Fantasy", slug: "dark-fantasy" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Horror", slug: "horror" },
  { name: "Isekai", slug: "isekai" },
  { name: "Martial Arts", slug: "martial-arts" },
  { name: "Post-apocalyptic", slug: "post-apocalyptic" },
  { name: "Psychological", slug: "psychological" },
  { name: "Romance", slug: "romance" },
  { name: "Slice of Life", slug: "slice-of-life" },
  { name: "Superhero", slug: "superhero" },
  { name: "Supernatural", slug: "supernatural" },
  { name: "Thriller", slug: "thriller" },
  { name: "Historical", slug: "historical" },
  { name: "Apocalypse", slug: "apocalypse" },
  { name: "Warna", slug: "warna" },
];

const seedGenres = async () => {
  try {
    console.log("🌱 Seeding genres...");

    for (const genre of genres) {
      await Genre.findOrCreate({
        where: { slug: genre.slug },
        defaults: genre,
      });
    }

    console.log("✅ Genres seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding genres:", error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  const { connectDB } = require("../config/db");
  connectDB().then(() => {
    seedGenres()
      .then(() => {
        console.log("✅ Seeding completed!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
      });
  });
}

module.exports = seedGenres;
