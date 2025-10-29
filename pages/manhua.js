import { createPaginatedPage } from '../app.js';
import { comics } from '../data.js';

export function renderManhuaPage() {
  const manhuaComics = comics.filter((c) => c.tags.includes('Manhua'));
   if (manhuaComics.length === 0) {
       const appContent = document.getElementById('app-content');
       if(appContent) {
            appContent.innerHTML = `<h2 class="text-2xl font-bold text-gray-800">Halaman Manhua</h2><p class="text-gray-600">Belum ada komik Manhua yang tersedia.</p>`;
       }
   } else {
        createPaginatedPage('Manhua', manhuaComics);
   }
}