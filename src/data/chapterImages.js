// src/data/chapterImages.js

// Base URL dari link yang kamu kasih
const BASE_URL = "https://img.komiku.org/wp-content/uploads/34855-";

// Kita generate Array panjang 56 secara otomatis
// Hasilnya: "...34855-1.jpg", "...34855-2.jpg", dst sampai 56.
export const dummyChapterImages = Array.from({ length: 56 }, (_, index) => {
  return `${BASE_URL}${index + 1}.jpg`;
});

export const dummyChapterInfo = {
  title: "Jujutsu Kaisen",
  chapterTitle: "Chapter 1: Ryomen Sukuna",
  // Nanti logic next/prev bisa diatur dinamis, ini contoh saja
  nextChapter: "/baca/chapter-2",
  prevChapter: null,
};