import { createPaginatedPage } from '../app.js';
import { comics } from '../data.js';
import { escapeHTML } from '../utils/helpers.js';

export function renderSearchPage(query) {
  const safeQuery = escapeHTML(query);
    
  const searchTerm = query?.toLowerCase() || '';
  const searchResults = comics.filter((c) =>
    c.title.toLowerCase().includes(searchTerm)
  );
    
  createPaginatedPage(`Hasil Pencarian untuk: "${safeQuery || ''}"`, searchResults);
}