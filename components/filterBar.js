export function renderFilterBar(uniqueTags, initialQuery = '') {
  const currentActiveFilters = window.appState.activeFilters;
  const currentSort = window.appState.currentSortOrder;
  
  const baseClasses = "filter-tag text-sm font-medium px-3 py-1 rounded-full cursor-pointer transition-colors duration-200 border-2 border-transparent";
  
  const normalClasses = "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500";
  
  const activeClasses = "bg-primary text-white border-primary-hover dark:bg-primary dark:text-white dark:border-indigo-400";

  return `
    <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 filter-bar-container">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Filter Berdasarkan Tag</h3>
      <div id="filter-tag-container" class="flex flex-wrap gap-2 mb-4">
        ${uniqueTags
          .map(
            (tag) => `
          <button class="${baseClasses} ${currentActiveFilters.includes(tag) ? activeClasses : normalClasses}" data-tag="${tag}">
            ${tag}
          </button>
        `
          )
          .join('')}
      </div>

      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Urutkan</h3>
      <div id="sort-button-container" class="flex flex-wrap gap-2 mb-4">
          <button data-sort="rating_desc" class="${baseClasses} ${currentSort === 'rating_desc' ? activeClasses : normalClasses}">Rating Tertinggi</button>
          <button data-sort="title_asc" class="${baseClasses} ${currentSort === 'title_asc' ? activeClasses : normalClasses}">Judul A-Z</button>
          <button data-sort="default" class="${baseClasses} ${currentSort === 'default' ? activeClasses : normalClasses}">Default</button>
      </div>

      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Cari Judul</h3>
      <form id="filter-search-form" class="flex">
        <input type="text" id="filter-search-input" value="${initialQuery}" placeholder="Cari berdasarkan judul..." class="flex-grow p-2 border border-gray-300 dark:border-gray-500 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-200 dark:placeholder-gray-400">
        <button type="submit" class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-hover">Cari</button>
      </form>
    </div>
  `;
}