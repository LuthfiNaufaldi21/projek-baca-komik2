import { auth } from '../utils/auth.js';

export function renderNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    const loggedIn = auth.isLoggedIn();
    const profileLink = loggedIn ? '#akun' : '#login';

    const navbarHTML = `
      <div class="flex justify-between items-center bg-white dark:bg-gray-800 p-3 px-6 shadow-md dark:shadow-black/20">
        <a href="#home" class="flex items-center">
          <img src="./public/logo.png" alt="Logo" class="h-[25px] w-auto" />
          <span class="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-primary">
            KOMIKITA
          </span>
        </a>
        <div class="flex items-center space-x-6">
          <div class="hidden md:flex items-center space-x-5">
            <a href="#daftar-komik" class="text-gray-600 dark:text-gray-300 hover:text-primary">Daftar Komik</a>
            <a href="#bookmark" class="text-gray-600 dark:text-gray-300 hover:text-primary">Bookmark</a>
            <a href="#berwarna" class="text-gray-600 dark:text-gray-300 hover:text-primary">Berwarna</a>
            <a href="#manga" class="text-gray-600 dark:text-gray-300 hover:text-primary">Manga</a>
            <a href="#manhwa" class="text-gray-600 dark:text-gray-300 hover:text-primary">Manhwa</a>
            <a href="#manhua" class="text-gray-600 dark:text-gray-300 hover:text-primary">Manhua</a>
          </div>
          <form id="search-form" class="flex">
            <input
              type="text"
              id="search-input"
              placeholder="Cari..."
              class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 dark:placeholder-gray-400 w-24 md:w-auto"
            />
            <button type="submit" class="px-3 py-1.5 bg-primary text-white text-sm rounded-r-md hover:bg-primary-hover">Cari</button>
          </form>
          <a href="${profileLink}" title="Akun Saya">
            <svg class="w-7 h-7 text-gray-600 dark:text-gray-400 hover:text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
          </a>
        </div>
      </div>
    `;
    navbarContainer.innerHTML = navbarHTML;

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const searchInput = document.getElementById('search-input');
          const query = searchInput.value;
          if (query) {
            window.location.hash = `#search?q=${encodeURIComponent(query)}`;
          }
        });
    }
}