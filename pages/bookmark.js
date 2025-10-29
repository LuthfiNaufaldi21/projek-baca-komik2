import { auth } from '../utils/auth.js';
import { createPaginatedPage } from '../app.js';
import { comics } from '../data.js';

export function renderBookmarkPage() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    if (!auth.isLoggedIn()) {
        appContent.innerHTML = `
        <h2 class="text-3xl font-bold text-gray-700 text-center mt-12">
            Anda harus login terlebih dahulu
        </h2>
        <p class="text-center mt-4">
            <a href="#login" class="text-primary hover:underline">Klik di sini untuk login</a>
        </p>
        `;
        return;
    }

    const user = auth.getUser();
    const bookmarkedComics = comics.filter((c) => user?.bookmarks?.includes(c.id));

    if (!bookmarkedComics || bookmarkedComics.length === 0) {
        appContent.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bookmark Saya</h2>
        <p class="text-gray-600">Anda belum memiliki bookmark.</p>
        `;
        return;
    }

    createPaginatedPage('Bookmark Saya', bookmarkedComics);
}