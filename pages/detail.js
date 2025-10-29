import { auth } from '../utils/auth.js';
import { comics } from '../data.js';

export function renderDetailPage(comicId) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    const comic = comics.find((c) => c.id === comicId);
    if (!comic) {
        appContent.innerHTML = '<p class="text-lg text-center text-red-600 font-semibold mt-10">⚠ Komik tidak ditemukan.</p>';
        return;
    }

    const isBookmarked = auth.isBookmarked(comic.id);

    const tagClasses = "detail-tag inline-block bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full capitalize";

    const tagsHTML = comic.tags
        .map((tag) => `<span class="${tagClasses}">${tag}</span>`)
        .join('');

    const bookmarkBtnBase = "bookmark-icon-btn w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border-2";
    const bookmarkBtnNormal = "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-200";
    const bookmarkBtnActive = "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 hover:bg-red-200 dark:hover:bg-red-800/40";

    const bookmarkIconSVG = `
        <svg class="w-6 h-6"
             fill="${isBookmarked ? 'currentColor' : 'none'}"
             stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
        </svg>
      `;

    appContent.innerHTML = `
        <a href="#daftar-komik"
           title="Kembali ke Daftar Komik"
           class="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-primary dark:hover:text-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </a>

        <hr class="my-4 border-gray-200 dark:border-gray-700">

        <div class="flex flex-col md:flex-row gap-6 md:gap-8">
          <img src="${comic.cover}" alt="${comic.title}"
               class="w-full md:w-64 h-auto object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700 self-start">

          <div class="flex-1">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">${comic.title}</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-4"><strong>Penulis:</strong> ${comic.author}</p>

            <div class="flex flex-wrap gap-2 mb-4">
              ${tagsHTML}
            </div>

            <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">${comic.synopsis}</p>

            <button id="bookmark-button"
                    title="${isBookmarked ? 'Hapus dari Bookmark' : 'Tambah ke Bookmark'}"
                    class="${bookmarkBtnBase} ${isBookmarked ? bookmarkBtnActive : bookmarkBtnNormal}">
              ${bookmarkIconSVG}
            </button>
          </div>
        </div>

        <hr class="my-6 border-gray-200 dark:border-gray-700">
        <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Daftar Chapter</h3>
        <ul class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          ${comic.chapters.length > 0 ? comic.chapters
            .map(
              (chapter) => `
            <li class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <a href="#read/${comic.id}/${chapter.id}" class="block p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                ${chapter.title}
              </a>
            </li>
          `
            )
            .join('') : '<li class="p-3 text-gray-500 dark:text-gray-400">Belum ada chapter.</li>'}
        </ul>
      `;

    const bookmarkButton = document.getElementById('bookmark-button');
    if (bookmarkButton) {
        const bookmarkIcon = bookmarkButton.querySelector('svg');
        bookmarkButton.addEventListener('click', () => {
            if (!auth.isLoggedIn()) {
              window.location.hash = '#login';
              return;
            }

            const isCurrentlyBookmarked = auth.isBookmarked(comic.id);

            if (isCurrentlyBookmarked) {
              auth.removeBookmark(comic.id);
              bookmarkButton.className = `${bookmarkBtnBase} ${bookmarkBtnNormal}`;
              bookmarkButton.title = 'Tambah ke Bookmark';
              if (bookmarkIcon) bookmarkIcon.setAttribute('fill', 'none');
            } else {
              auth.addBookmark(comic.id);
              bookmarkButton.className = `${bookmarkBtnBase} ${bookmarkBtnActive}`;
              bookmarkButton.title = 'Hapus dari Bookmark';
              if (bookmarkIcon) bookmarkIcon.setAttribute('fill', 'currentColor');
            }
        });
    }
}