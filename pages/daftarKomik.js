import { renderFilterBar } from '../components/filterBar.js';
import { renderPagination } from '../components/pagination.js';
import { renderComicGrid } from '../components/comicCard.js';
import { comicsPerPage, initScrollObserver, setCurrentPaginator, setCurrentPage, setActiveFilters, setCurrentSortOrder } from '../app.js';
import { comics } from '../data.js';
import { escapeHTML } from '../utils/helpers.js';

function getAllUniqueTags() {
    const allTags = new Set();
    comics.forEach((comic) => {
      comic.tags.forEach((tag) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
}

function applyFiltersAndRenderInternal() {
    const queryInput = document.getElementById('filter-search-input');
    const query = queryInput?.value.toLowerCase() || '';

    const state = window.appState;

    let filteredComics = comics.filter((comic) => {
      const titleMatch = comic.title.toLowerCase().includes(query);
      const tagsMatch = state.activeFilters.every((filterTag) =>
        comic.tags.includes(filterTag)
      );
      return titleMatch && tagsMatch;
    });

    if (state.currentSortOrder === 'rating_desc') {
      filteredComics.sort((a, b) => b.rating - a.rating);
    } else if (state.currentSortOrder === 'title_asc') {
      filteredComics.sort((a, b) => a.title.localeCompare(b.title));
    }

    const totalItems = filteredComics.length;
    const startIndex = (state.currentPage - 1) * comicsPerPage;
    const endIndex = startIndex + comicsPerPage;
    const comicsToShow = filteredComics.slice(startIndex, endIndex);

    const gridContainer = document.getElementById('comic-grid-container');
    const paginationContainer = document.getElementById('pagination-container');

    if (gridContainer) {
      gridContainer.innerHTML = renderComicGrid(comicsToShow);
    }
    if (paginationContainer) {
      paginationContainer.innerHTML = renderPagination(
        totalItems,
        comicsPerPage,
        state.currentPage
      );
    }

    const baseClasses = "filter-tag text-sm font-medium px-3 py-1 rounded-full cursor-pointer transition-colors duration-200 border-2 border-transparent";
    const normalClasses = "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500";
    const activeClasses = "bg-primary text-white border-primary-hover dark:bg-primary dark:text-white dark:border-indigo-400";

    const sortButtons = document.querySelectorAll('#sort-button-container .filter-tag');
    sortButtons.forEach(button => {
        const sortType = button.dataset.sort;
        if (sortType === state.currentSortOrder) {
            button.className = `${baseClasses} ${activeClasses}`;
        } else {
            button.className = `${baseClasses} ${normalClasses}`;
        }
    });

    const tagButtons = document.querySelectorAll('#filter-tag-container .filter-tag');
    tagButtons.forEach(button => {
        const tag = button.dataset.tag;
        if (state.activeFilters.includes(tag)) {
            button.className = `${baseClasses} ${activeClasses}`;
        } else {
            button.className = `${baseClasses} ${normalClasses}`;
        }
    });

    initScrollObserver();
}


export function renderDaftarKomikPage() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    const uniqueTags = getAllUniqueTags();
    setCurrentPaginator(applyFiltersAndRenderInternal);

    let initialQuery = '';
    const hash = window.location.hash;
    if (hash.startsWith('#search?q=')) {
        const params = new URLSearchParams(hash.split('?')[1]);
        const query = params.get('q');
        initialQuery = query ? escapeHTML(decodeURIComponent(query)) : '';
    }

    appContent.innerHTML = `
      ${renderFilterBar(uniqueTags, initialQuery)}
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Daftar Komik</h2>
      <div id="comic-grid-container"></div>
      <div id="pagination-container" class="mt-8"></div>
    `;

    document
      .getElementById('filter-search-form')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        setCurrentPage(1);
        applyFiltersAndRenderInternal();
      });

    document
      .getElementById('filter-tag-container')
      .addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
          const tag = e.target.dataset.tag;

          let currentFilters = [...window.appState.activeFilters];
          if (currentFilters.includes(tag)) {
            currentFilters = currentFilters.filter((t) => t !== tag);
          } else {
            currentFilters.push(tag);
          }
          setActiveFilters(currentFilters);
          setCurrentPage(1);
          applyFiltersAndRenderInternal();
        }
      });

    document
      .getElementById('sort-button-container')
      .addEventListener('click', (e) => {
          if (e.target.classList.contains('filter-tag') && e.target.dataset.sort) {
              setCurrentSortOrder(e.target.dataset.sort);
              setCurrentPage(1);
              applyFiltersAndRenderInternal();
          }
      });

    applyFiltersAndRenderInternal();
}