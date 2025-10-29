export function renderComicCard(comic) {
    const isColored = comic.tags.includes('Warna');
    const genreTags = comic.tags
      .filter(t => !['Warna', 'Manga', 'Manhwa', 'Manhua'].includes(t))
      .slice(0, 2);

    const tagClasses = "card-tag inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:text-gray-100 transition-colors duration-200";

    return `
      <div class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden
                  shadow-sm transition-all duration-300
                  hover:shadow-xl dark:hover:shadow-gray-600/50 hover:border-primary fade-in-card">

        <a href="#detail/${comic.id}" class="group">
          ${isColored ? `<span class="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">WARNA</span>` : ''}

          <div class="overflow-hidden">
            <img
              src="${comic.cover}"
              alt="${comic.title}"
              class="w-full h-64 object-cover
                     transition-transform duration-300
                     group-hover:scale-105"
            >
          </div>

          <div class="p-3">
            <h3
              class="text-md font-semibold text-gray-800 dark:text-gray-100 truncate
                     transition-colors duration-300
                     group-hover:text-primary"
              title="${comic.title}"
            >
              ${comic.title}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">⭐ ${comic.rating}</p>
            <div class="flex flex-wrap gap-1">
              ${genreTags.map(tag => `<span class="${tagClasses}">${tag}</span>`).join('')}
            </div>
          </div>
        </a>
      </div>
    `;
  }

export function renderComicGrid(comicList) {
    if (comicList.length === 0) {
        return '<p class="text-gray-600 dark:text-gray-400">Tidak ada komik yang ditemukan.</p>';
    }
    return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        ${comicList.map(renderComicCard).join('')}
        </div>
    `;
}