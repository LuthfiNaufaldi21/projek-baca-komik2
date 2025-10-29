import { renderHomePage, cleanupHomePage } from './pages/home.js';
import { renderDaftarKomikPage } from './pages/daftarKomik.js';
import { renderBerwarnaPage } from './pages/berwarna.js';
import { renderBookmarkPage } from './pages/bookmark.js';
import { renderLoginPage } from './pages/login.js';
import { renderAccountPage } from './pages/account.js';
import { renderMangaPage } from './pages/manga.js';
import { renderManhwaPage } from './pages/manhwa.js';
import { renderManhuaPage } from './pages/manhua.js';
import { renderSearchPage } from './pages/search.js';
import { renderDetailPage } from './pages/detail.js';
import { auth } from './utils/auth.js';
import { cleanupPageLogic as generalCleanup } from './utils/helpers.js';

export function router() {
  const appContent = document.getElementById('app-content');
  if (!appContent) return;
  appContent.innerHTML = '<p class="text-center text-gray-500 py-10">Memuat...</p>';

  const path = window.location.hash || '#home';

  cleanupHomePage();
  generalCleanup();

  setTimeout(() => {
     if (appContent.innerHTML === '<p class="text-center text-gray-500 py-10">Memuat...</p>') {
         appContent.innerHTML = '';
     }

      if (path === '#home') {
        renderHomePage();
      } else if (path === '#daftar-komik') {
        renderDaftarKomikPage();
      } else if (path === '#berwarna') {
        renderBerwarnaPage();
      } else if (path === '#bookmark') {
        renderBookmarkPage();
      } else if (path === '#login') {
        renderLoginPage();
      } else if (path === '#akun') {
        renderAccountPage();
      } else if (path === '#manga') {
        renderMangaPage();
      } else if (path === '#manhwa') {
        renderManhwaPage();
      } else if (path === '#manhua') {
        renderManhuaPage();
      } else if (path.startsWith('#search')) {
        const queryString = path.split('?')[1] || '';
        const params = new URLSearchParams(queryString);
        const query = params.get('q');
        renderSearchPage(query);
      } else if (path.startsWith('#detail/')) {
        const comicId = path.split('/')[1];
        renderDetailPage(comicId);
      } else if (path.startsWith('#read/')) {
        const parts = path.split('/');
        const comicId = parts[1];
        const chapterId = parts[2];
        appContent.innerHTML = `<h2 class="text-2xl font-bold text-gray-800">Membaca ${comicId} - ${chapterId}</h2><p class="text-gray-600">(Halaman pembaca akan ada di sini)</p>`;
      } else {
        appContent.innerHTML = '<h2 class="text-2xl font-bold text-center text-red-600 mt-10">🚨 404 - Halaman Tidak Ditemukan 🚨</h2><p class="text-center text-gray-600">Maaf, halaman yang Anda cari tidak ada.</p>';
      }
  }, 50);
}