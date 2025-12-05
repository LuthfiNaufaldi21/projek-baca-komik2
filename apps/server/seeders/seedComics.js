const { Comic, Genre, ComicGenre } = require("../models");

// Data komik dari file lama
const comicsData = [
  {
    slug: "solo-leveling",
    title: "Solo Leveling",
    author: "Chugong",
    status: "Tamat",
    cover_url:
      "https://thumbor.prod.vidiocdn.com/LhjqB-5aarJcHer2t59usE2xXn8=/filters:quality(70)/vidio-media-production/uploads/image/source/49357/27d5f1.jpg",
    synopsis:
      "Kisah hunter terlemah di dunia, Sung Jin-Woo, yang mendapatkan kesempatan kedua melalui 'System' misterius.",
    rating: 9.8,
    type: "Manhwa",
    tags: ["Warna", "Action", "Fantasy"],
  },
  {
    slug: "komik-one-piece-indo",
    title: "One Piece",
    author: "Eiichiro Oda",
    status: "Update Tiap Minggu",
    cover_url:
      "https://m.media-amazon.com/images/M/MV5BMTNjNGU4NTUtYmVjMy00YjRiLTkxMWUtNzZkMDNiYjZhNmViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    synopsis:
      "Petualangan Monkey D. Luffy dan krunya mencari harta karun legendaris, One Piece, untuk menjadi Raja Bajak Laut.",
    rating: 9.5,
    type: "Manga",
    tags: ["Adventure", "Fantasy"],
  },
  {
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    author: "Gege Akutami",
    status: "Tamat",
    cover_url:
      "https://thumbor.prod.vidiocdn.com/w9gDKJuYqIooJcv5svHJOH-JGac=/filters:quality(70)/vidio-media-production/uploads/image/source/49405/0990e8.png",
    synopsis:
      "Yuji Itadori, seorang siswa SMA dengan kekuatan fisik luar biasa, menelan jari terkutuk untuk menyelamatkan temannya...",
    rating: 9.2,
    type: "Manga",
    tags: ["Action", "Supernatural", "Dark Fantasy"],
  },
  {
    slug: "spy-x-family",
    title: "Spy x Family",
    author: "Tatsuya Endo",
    status: "Update Tiap 2 Minggu",
    cover_url:
      "https://awsimages.detik.net.id/community/media/visual/2025/09/02/serial-anime-spy-x-family-season-3-1756791886541.webp?w=1200",
    synopsis:
      "Seorang mata-mata, seorang pembunuh bayaran, dan seorang telepat hidup bersama sebagai keluarga palsu...",
    rating: 9.0,
    type: "Manga",
    tags: ["Action", "Comedy", "Slice of Life"],
  },
  {
    slug: "tower-of-god",
    title: "Tower of God",
    author: "S.I.U",
    status: "Update Tiap Minggu",
    cover_url:
      "https://upload.wikimedia.org/wikipedia/id/7/7d/Tower_of_God_Volume_1_Cover.jpg",
    synopsis:
      "Seorang anak laki-laki bernama Bam, yang seumur hidupnya hanya mengenal seorang gadis, Rachel, mengikutinya masuk ke Menara misterius...",
    rating: 9.4,
    type: "Manhwa",
    tags: ["Warna", "Fantasy", "Action"],
  },
  {
    slug: "attack-on-titan",
    title: "Attack on Titan",
    author: "Hajime Isayama",
    status: "Tamat",
    cover_url:
      "https://posterspy.com/wp-content/uploads/2024/03/aot-poster-2.jpg",
    synopsis:
      "Di dunia di mana umat manusia hidup di dalam kota-kota yang dikelilingi oleh tembok besar sebagai pelindung dari Titan...",
    rating: 9.6,
    type: "Manga",
    tags: ["Action", "Dark Fantasy", "Post-apocalyptic"],
  },
  {
    slug: "tbate",
    title: "The Beginning After The End",
    author: "TurtleMe",
    status: "Update Tiap Minggu",
    cover_url:
      "https://us-a.tapas.io/sa/f7/16e8def2-901b-45ea-8d86-2aa4b05cc86b_z.jpg",
    synopsis:
      "Raja Grey memiliki kekuatan, kekayaan, dan martabat yang tak tertandingi di dunia yang diatur oleh kemampuan bela diri. Namun...",
    rating: 9.7,
    type: "Manhwa",
    tags: ["Warna", "Isekai", "Fantasy", "Action"],
  },
  {
    slug: "chainsaw-man",
    title: "Chainsaw Man",
    author: "Tatsuki Fujimoto",
    status: "Update Tiap 2 Minggu",
    cover_url:
      "https://m.media-amazon.com/images/M/MV5BZmMzNGVhODktYmU5MS00MDg1LThlNTEtNTMyYTg5MDA0Njk4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    synopsis:
      "Denji memiliki mimpi sederhana—hidup bahagia dan damai. Namun, ia terpaksa membunuh iblis untuk Yakuza...",
    rating: 9.1,
    type: "Manga",
    tags: ["Action", "Dark Fantasy", "Supernatural"],
  },
  {
    slug: "omniscient-reader",
    title: "Omniscient Reader's Viewpoint",
    author: "SingShong",
    status: "Update Tiap Minggu",
    cover_url:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1602711402i/55673120.jpg",
    synopsis:
      "Suatu hari, protagonis kita Kim Dokja mendapati dirinya terjebak dalam adegan novel web favoritnya...",
    rating: 9.9,
    type: "Manhwa",
    tags: ["Warna", "Action", "Fantasy", "Apocalypse"],
  },
  {
    slug: "my-hero-academia",
    title: "My Hero Academia",
    author: "Kohei Horikoshi",
    status: "Tamat",
    cover_url:
      "https://imgc.allpostersimages.com/img/posters/trends-international-my-hero-academia-season-6-deku-key-art_u-l-q1t16tx0.jpg?artHeight=550&artPerspective=y&artWidth=550&background=ffffff",
    synopsis:
      "Izuku Midoriya, seorang anak laki-laki yang lahir tanpa kekuatan super (Quirks) di dunia di mana hal itu biasa...",
    rating: 8.8,
    type: "Manga",
    tags: ["Superhero", "Action", "Comedy"],
  },
  {
    slug: "demon-slayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    author: "Koyoharu Gotouge",
    status: "Tamat",
    cover_url:
      "https://images-cdn.ubuy.co.id/634cbc08480a4356f856e6f3-clearly-uzui-tengen-and-his-wives-anime.jpg",
    synopsis:
      "Tanjiro Kamado, seorang anak laki-laki yang menjadi pembasmi iblis setelah keluarganya dibantai dan adiknya diubah menjadi iblis.",
    rating: 9.4,
    type: "Manga",
    tags: ["Action", "Dark Fantasy", "Supernatural"],
  },
  {
    slug: "berserk",
    title: "Berserk",
    author: "Kentaro Miura",
    status: "Update Tidak Tentu",
    cover_url:
      "https://images-cdn.ubuy.co.id/667d8d9aed488b1192747544-lugema-classic-anime-berserk-poster.jpg",
    synopsis:
      "Guts, seorang mantan tentara bayaran, bertarung melawan takdir dan iblis-iblis mengerikan di dunia fantasi kelam.",
    rating: 9.9,
    type: "Manga",
    tags: ["Action", "Dark Fantasy", "Horror"],
  },
  {
    slug: "vinland-saga",
    title: "Vinland Saga",
    author: "Makoto Yukimura",
    status: "Update Tiap Bulan",
    cover_url:
      "https://images-cdn.ubuy.co.id/634d1cae0ce5565a65234fe6-vinland-saga.jpg",
    synopsis:
      "Petualangan Thorfinn, seorang pemuda Viking, yang mencari balas dendam atas kematian ayahnya dan mencari arti 'prajurit sejati'.",
    rating: 9.3,
    type: "Manga",
    tags: ["Action", "Adventure", "Historical"],
  },
  {
    slug: "fullmetal-alchemist",
    title: "Fullmetal Alchemist",
    author: "Hiromu Arakawa",
    status: "Tamat",
    cover_url: "https://m.media-amazon.com/images/I/71YYVENqPaL.jpg",
    synopsis:
      "Dua bersaudara, Edward dan Alphonse Elric, mencari Batu Bertuah untuk memulihkan tubuh mereka setelah eksperimen alkimia gagal.",
    rating: 9.7,
    type: "Manga",
    tags: ["Action", "Adventure", "Fantasy"],
  },
  {
    slug: "death-note",
    title: "Death Note",
    author: "Tsugumi Ohba",
    status: "Tamat",
    cover_url:
      "https://i.pinimg.com/originals/05/25/46/052546773e68724069963f851f30a2a8.jpg",
    synopsis:
      "Seorang siswa jenius menemukan buku catatan misterius yang dapat membunuh siapa saja yang namanya ditulis di dalamnya.",
    rating: 9.2,
    type: "Manga",
    tags: ["Thriller", "Supernatural", "Psychological"],
  },
  {
    slug: "tales-of-demons-and-gods",
    title: "Tales of Demons and Gods",
    author: "Mad Snail",
    status: "Update Tiap Minggu",
    cover_url:
      "https://m.media-amazon.com/images/I/81wDz65+NOL.AC_UF1000,1000_QL80.jpg",
    synopsis:
      "Nie Li, seorang Spiritualis Iblis terkuat, terlahir kembali ke masa lalunya saat masih muda. Berbekal pengetahuan masa depan, dia bertujuan untuk melindungi kota dan orang yang dicintainya.",
    rating: 9.1,
    type: "Manhua",
    tags: ["Warna", "Action", "Adventure", "Fantasy"],
  },
  {
    slug: "battle-through-the-heavens",
    title: "Battle Through the Heavens",
    author: "Tian Can Tu Dou",
    status: "Update Tiap Minggu",
    cover_url:
      "https://cdn.kobo.com/book-images/659526c1-395f-4f9f-b319-c8dbd04a09b0/1200/1200/False/battle-through-the-heavens-t01.jpg",
    synopsis:
      "Xiao Yan, seorang jenius yang kehilangan kekuatannya, berjuang untuk mendapatkan kembali kehormatannya dan menjadi alkemis terkuat.",
    rating: 9.0,
    type: "Manhua",
    tags: ["Warna", "Action", "Fantasy", "Martial Arts"],
  },
  {
    slug: "soul-land",
    title: "Soul Land (Douluo Dalu)",
    author: "Tang Jia San Shao",
    status: "Tamat",
    cover_url:
      "https://i.pinimg.com/736x/90/ee/43/90ee43b0b1e5a74d48d9194deb467e14.jpg",
    synopsis:
      "Tang San, seorang murid sekte Tang, bereinkarnasi ke dunia lain yang penuh dengan Roh Bela Diri. Dia bersumpah untuk membawa kemuliaan sekte Tang ke dunia baru ini.",
    rating: 9.2,
    type: "Manhua",
    tags: ["Warna", "Action", "Fantasy", "Romance"],
  },
  {
    slug: "martial-peak",
    title: "Martial Peak",
    author: "Momo",
    status: "Tamat",
    cover_url:
      "https://i.pinimg.com/564x/34/71/ba/3471ba77970a7fcd02f397ff70a4949f.jpg",
    synopsis:
      "Perjalanan Yang Kai untuk mendaki puncak dunia persilatan setelah menemukan Buku Hitam misterius.",
    rating: 8.9,
    type: "Manhua",
    tags: ["Warna", "Action", "Fantasy", "Martial Arts"],
  },
  {
    slug: "apotheosis",
    title: "Apotheosis",
    author: "Ranzai Studio",
    status: "Update Tiap Minggu",
    cover_url:
      "https://i.pinimg.com/736x/22/de/b6/22deb6d656c1c1b1caf2bd089b4618db.jpg",
    synopsis:
      "Luo Zheng, mantan tuan muda yang menjadi budak, secara tidak sengaja menemukan metode ilahi yang mengubah takdirnya menuju puncak kekuatan.",
    rating: 8.8,
    type: "Manhua",
    tags: ["Warna", "Action", "Fantasy", "Martial Arts"],
  },
];

const seedComics = async () => {
  try {
    console.log("🌱 Seeding comics...");

    for (const comicData of comicsData) {
      // Cari atau buat comic
      const [comic, created] = await Comic.findOrCreate({
        where: { slug: comicData.slug },
        defaults: {
          title: comicData.title,
          author: comicData.author,
          status: comicData.status,
          cover_url: comicData.cover_url,
          synopsis: comicData.synopsis,
          rating: comicData.rating,
          type: comicData.type,
        },
      });

      if (created || comicData.tags) {
        // Hapus relasi genre lama (jika ada)
        await ComicGenre.destroy({ where: { comic_id: comic.id } });

        // Tambahkan genre baru
        for (const tagName of comicData.tags) {
          const genre = await Genre.findOne({
            where: { name: tagName },
          });

          if (genre) {
            await ComicGenre.create({
              comic_id: comic.id,
              genre_id: genre.id,
            });
          } else {
            console.warn(
              `⚠️  Genre "${tagName}" tidak ditemukan untuk comic "${comicData.title}"`
            );
          }
        }

        console.log(`✅ Seeded: ${comicData.title}`);
      } else {
        console.log(`⏭️  Skipped (already exists): ${comicData.title}`);
      }
    }

    console.log("✅ Comics seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding comics:", error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  const { connectDB } = require("../config/db");
  connectDB().then(() => {
    seedComics()
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

module.exports = seedComics;
