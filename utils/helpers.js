import { renderComicGrid } from '../components/comicCard.js';
import { renderPagination } from '../components/pagination.js';
import { comicsPerPage, setCurrentPaginator } from '../app.js';

export function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function(match) {
        switch (match) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#39;';
            default:
                return match;
        }
    });
}

export function cleanupPageLogic() {
  window.appState.activeFilters = [];
  window.appState.currentPage = 1;
  window.appState.currentPaginator = null;
  window.appState.currentSortOrder = 'default';
  if (window.appState.heroIntervalRef && window.appState.heroIntervalRef.current) {
    clearInterval(window.appState.heroIntervalRef.current);
    window.appState.heroIntervalRef.current = null;
  }
}

export function initScrollObserver() {
    const cards = document.querySelectorAll('.fade-in-card');
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            }
        });
        },
        {
        rootMargin: '0px',
        threshold: 0.1,
        }
    );

    cards.forEach((card) => {
        observer.observe(card);
    });
}

export function createPaginatedPage(title, comicList) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    const paginator = () => {
        const totalItems = comicList.length;
        const startIndex = (window.appState.currentPage - 1) * comicsPerPage;
        const endIndex = startIndex + comicsPerPage;
        const comicsToShow = comicList.slice(startIndex, endIndex);

        const gridContainer = appContent.querySelector('#comic-grid-container');
        const paginationContainer = appContent.querySelector('#pagination-container');

        if (gridContainer) gridContainer.innerHTML = renderComicGrid(comicsToShow);
        if (paginationContainer)
            paginationContainer.innerHTML = renderPagination(
                totalItems,
                comicsPerPage,
                window.appState.currentPage
            );
        initScrollObserver();
    };

    setCurrentPaginator(paginator);

    appContent.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">${title}</h2>
        <div id="comic-grid-container"></div>
        <div id="pagination-container" class="mt-8"></div>
    `;
    paginator();
}