import { createPaginatedPage } from '../app.js';
import { comics } from '../data.js';

export function renderBerwarnaPage() {
  const coloredComics = comics.filter((c) => c.tags.includes('Warna'));
  createPaginatedPage('Komik Berwarna', coloredComics);
}