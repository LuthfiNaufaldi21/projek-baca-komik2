import { renderComicGrid } from '../components/comicCard.js';
import { initScrollObserver } from '../utils/helpers.js';
import { comics } from '../data.js';

let heroSliderInterval = null;

function initHeroSliderInternal() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (slides.length === 0) return;

    let currentSlideIndex = 0;

    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            const imageUrl = slide.dataset.backgroundImage;

            slide.style.backgroundImage = `url('${imageUrl}')`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
            slide.style.backgroundRepeat = 'no-repeat';
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlideIndex = index;
    };

    showSlide(currentSlideIndex);

    if (heroSliderInterval) clearInterval(heroSliderInterval);
     if (window.appState && window.appState.heroIntervalRef) {
        window.appState.heroIntervalRef.current = setInterval(() => {
            let nextIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(nextIndex);
        }, 4000);
        heroSliderInterval = window.appState.heroIntervalRef.current;
     } else {
         heroSliderInterval = setInterval(() => {
            let nextIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(nextIndex);
        }, 4000);
     }


    dots.forEach((dot) => {
        const newDot = dot.cloneNode(true);
        dot.parentNode.replaceChild(newDot, dot);

        newDot.addEventListener('click', () => {
            const index = parseInt(newDot.dataset.dotIndex);
            showSlide(index);
            clearInterval(heroSliderInterval);
            if(window.appState && window.appState.heroIntervalRef.current) {
                clearInterval(window.appState.heroIntervalRef.current);
            }
            const startNewInterval = () => {
                 let nextIndex = (currentSlideIndex + 1) % slides.length;
                 showSlide(nextIndex);
            };
            const newIntervalId = setInterval(startNewInterval, 4000);
             heroSliderInterval = newIntervalId;
             if(window.appState && window.appState.heroIntervalRef) {
                 window.appState.heroIntervalRef.current = newIntervalId;
             }
        });
    });
}

export function cleanupHomePage() {
    if (heroSliderInterval) {
        clearInterval(heroSliderInterval);
        heroSliderInterval = null;
    }
     if(window.appState && window.appState.heroIntervalRef.current) {
         clearInterval(window.appState.heroIntervalRef.current);
         window.appState.heroIntervalRef.current = null;
     }
}


export function renderHomePage() {
  const appContent = document.getElementById('app-content');
  if (!appContent) return;

  const featuredComics = comics.slice(0, 5);
  const latestComics = comics.slice(0, 10);

  const sliderHTML = `
    <div class="max-w-5xl mx-auto h-[300px] rounded-lg overflow-hidden relative shadow-lg mb-8">
      ${featuredComics
        .map(
          (comic, index) => {
            const hoverTags = comic.tags
              .filter(t => !['Warna', 'Manga', 'Manhwa', 'Manhua'].includes(t))
              .slice(0, 3);
            const hoverTagsHTML = hoverTags.map(tag => `<span>${tag}</span>`).join('');

            return `
              <div
                class="hero-slide ${index === 0 ? 'active' : ''}"
                data-slide-index="${index}"
                data-background-image="${comic.cover}"
              >
                <a href="#detail/${comic.id}" class="hero-slide-link">
                  <img
                    src="${comic.cover}"
                    alt="${comic.title}"
                    class="comic-cover-small"
                  >

                  <div class="hover-content">
                    <h3 class="comic-title-hover">${comic.title}</h3>
                    <div class="comic-tags-hover">${hoverTagsHTML}</div>
                    <p class="comic-synopsis-hover">${comic.synopsis}</p>
                  </div>
                </a>
              </div>
            `;
          }
        )
        .join('')}

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        ${featuredComics
          .map(
            (_, index) => `
          <div class="hero-dot ${
            index === 0 ? 'active' : ''
          }" data-dot-index="${index}"></div>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  const viewAllButtonHTML = `
    <div class="text-center mt-6">
      <a href="#daftar-komik"
         class="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-md
                hover:bg-primary-hover transition-colors duration-200">
        Lihat Semua Komik
      </a>
    </div>
  `;

  appContent.innerHTML = `
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Komik Populer</h2>
    ${sliderHTML}
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 mt-8">Komik Terbaru</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-4">Telusuri 10 komik terbaru yang tersedia di web kami.</p>
    <hr class="mb-4 border-gray-200 dark:border-gray-700">
    <div id="comic-grid-container">${renderComicGrid(latestComics)}</div>
    ${viewAllButtonHTML}
  `;

  initHeroSliderInternal();
  initScrollObserver();
}