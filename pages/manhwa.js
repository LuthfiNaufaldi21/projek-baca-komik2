import { createPaginatedPage } from '../app.js';
import { comics } from '../data.js';

export function renderManhwaPage() {
  const manhwaComics = comics.filter((c) => c.tags.includes('Manhwa'));
  createPaginatedPage('Manhwa', manhwaComics);
}