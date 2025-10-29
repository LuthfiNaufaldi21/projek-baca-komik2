import { createPaginatedPage } from '../app.js';
import { comics } from '../data.js';

export function renderMangaPage() {
  const mangaComics = comics.filter((c) => c.tags.includes('Manga'));
  createPaginatedPage('Manga', mangaComics);
}