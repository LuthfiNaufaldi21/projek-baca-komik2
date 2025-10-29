import { createPaginatedPage } from '../app.js';
import { comics } from '../data.js';

export function renderSearchPage(query) {
  const searchTerm = query?.toLowerCase() || '';
  const searchResults = comics.filter((c) =>
    c.title.toLowerCase().includes(searchTerm)
  );
  createPaginatedPage(`Hasil Pencarian untuk: "${query || ''}"`, searchResults);
}