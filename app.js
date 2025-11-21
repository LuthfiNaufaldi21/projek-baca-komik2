import { renderNavbar } from './components/navbar.js';
import { router } from './router.js';
import { initScrollObserver, createPaginatedPage, cleanupPageLogic, escapeHTML } from './utils/helpers.js';
import { comics } from './data.js';
import { renderPagination } from './components/pagination.js';
import { renderComicGrid } from './components/comicCard.js';
import { initializeThemeToggle } from './utils/theme.js';

window.appState = {
    currentPage: 1,
    activeFilters: [],
    currentSortOrder: 'default',
    currentPaginator: null,
    heroIntervalRef: { current: null }
};

export const comicsPerPage = 10;

export function setCurrentPage(page) {
    window.appState.currentPage = page;
}
export function setActiveFilters(filters) {
    window.appState.activeFilters = filters;
}
export function setCurrentSortOrder(order) {
    window.appState.currentSortOrder = order;
}
export function setCurrentPaginator(paginatorFunc) {
    window.appState.currentPaginator = paginatorFunc;
}

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    initializeThemeToggle(document.getElementById('navbar-container'));
    router();
});

function smoothNavigate() {
    const app = document.getElementById('app-content');
    if (!app) return;
    app.classList.add('fade-out');
    setTimeout(() => {
        router();
        app.classList.remove('fade-out');
    }, 150);
}

window.addEventListener('hashchange', smoothNavigate);

let lastScrollY = window.scrollY;
const backToTopBtn = document.getElementById('back-to-top-btn');
const navbarContainer = document.getElementById('navbar-container');
const appContent = document.getElementById('app-content');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (navbarContainer) {
        if (currentScrollY > lastScrollY) {
            if (currentScrollY > 100) navbarContainer.classList.add('navbar-hidden');
        } else {
            navbarContainer.classList.remove('navbar-hidden');
        }
    }

    lastScrollY = currentScrollY;

    if (backToTopBtn) {
        if (window.scrollY > 300) backToTopBtn.classList.add('show');
        else backToTopBtn.classList.remove('show');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (appContent) {
    appContent.addEventListener('click', (e) => {
        const paginationLink = e.target.closest('.pagination-link');
        if (!paginationLink || paginationLink.classList.contains('disabled')) return;

        e.preventDefault();
        const page = paginationLink.dataset.page;

        if (page) {
            setCurrentPage(parseInt(page));
            if (window.appState.currentPaginator) {
                window.appState.currentPaginator();
                window.scrollTo(0, 0);
            }
        }
    });
}

export { initScrollObserver, createPaginatedPage, comics, cleanupPageLogic, escapeHTML };
export { renderComicGrid, renderPagination };
