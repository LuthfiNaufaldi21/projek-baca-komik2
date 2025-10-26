const appContent = document.getElementById('app-content');
const navbarContainer = document.getElementById('navbar-container');
let heroSliderInterval = null;
let activeFilters = [];
let currentSortOrder = 'default';

let currentPage = 1;
const comicsPerPage = 10;
let currentPaginator = null;

const auth = {
  isLoggedIn: () => !!localStorage.getItem('komikita-user'),
  getUser: () => JSON.parse(localStorage.getItem('komikita-user')),
  login: (username) => {
    const user = { username: username, bookmarks: [] };
    localStorage.setItem('komikita-user', JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem('komikita-user');
  },
  isBookmarked: (comicId) => {
    if (!auth.isLoggedIn()) return false;
    const user = auth.getUser();
    return user.bookmarks.includes(comicId);
  },
  addBookmark: (comicId) => {
    if (!auth.isLoggedIn()) return;
    const user = auth.getUser();
    if (!user.bookmarks.includes(comicId)) {
      user.bookmarks.push(comicId);
      localStorage.setItem('komikita-user', JSON.stringify(user));
    }
  },
  removeBookmark: (comicId) => {
    if (!auth.isLoggedIn()) return;
    const user = auth.getUser();
    user.bookmarks = user.bookmarks.filter((id) => id !== comicId);
    localStorage.setItem('komikita-user', JSON.stringify(user));
  },
};

function renderNavbar() {
  const loggedIn = auth.isLoggedIn();
  const profileLink = loggedIn ? '#akun' : '#login';

  const navbarHTML = `
    <div class="flex justify-between items-center bg-white p-3 px-6 shadow-md">
      <a href="#home" class="text-xl font-bold text-gray-800 hover:text-primary">KOMIKITA</a>
      <div class="flex items-center space-x-6">
        <div class="hidden md:flex items-center space-x-5">
          <a href="#daftar-komik" class="text-gray-600 hover:text-primary">Daftar Komik</a>
          <a href="#bookmark" class="text-gray-600 hover:text-primary">Bookmark</a>
          <a href="#berwarna" class="text-gray-600 hover:text-primary">Berwarna</a>
          <a href="#manga" class="text-gray-600 hover:text-primary">Manga</a>
          <a href="#manhwa" class="text-gray-600 hover:text-primary">Manhwa</a>
          <a href="#manhua" class="text-gray-600 hover:text-primary">Manhua</a>
        </div>
        <form id="search-form" class="flex">
          <input 
            type="text" 
            id="search-input"
            placeholder="Cari..." 
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-24 md:w-auto"
          />
          <button type="submit" class="px-3 py-1.5 bg-primary text-white text-sm rounded-r-md hover:bg-primary-hover">Cari</button>
        </form>
        <a href="${profileLink}" title="Akun Saya">
          <svg class="w-7 h-7 text-gray-600 hover:text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </a>
      </div>
    </div>
  `;
  navbarContainer.innerHTML = navbarHTML;

  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query) {
      window.location.hash = `#search?q=${query}`;
    }
  });
}

function renderComicCard(comic) {
  const isColored = comic.tags.includes('Warna');
  const genreTags = comic.tags
    .filter(
      (t) => t !== 'Warna' && t !== 'Manga' && t !== 'Manhwa' && t !== 'Manhua'
    )
    .slice(0, 2);

  return `
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden
                shadow-sm transition-all duration-300
                hover:shadow-xl hover:border-primary fade-in-card">
      
      <a href="#detail/${comic.id}" class="group">
        ${
          isColored
            ? `<span class="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded z-10">WARNA</span>`
            : ''
        }
        
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
            class="text-md font-semibold text-gray-800 truncate 
                   transition-colors duration-300 
                   group-hover:text-primary" 
            title="${comic.title}"
          >
            ${comic.title}
          </h3>
          <p class="text-sm text-gray-600 mb-2">⭐ ${comic.rating}</p>
          <div class="flex flex-wrap gap-1">
            ${genreTags
              .map((tag) => `<span class="card-tag">${tag}</span>`)
              .join('')}
          </div>
        </div>
      </a>
    </div>
  `;
}

function getAllUniqueTags() {
  const allTags = new Set();
  comics.forEach((comic) => {
    comic.tags.forEach((tag) => allTags.add(tag));
  });
  return Array.from(allTags).sort();
}

function renderFilterBar(uniqueTags) {
  return `
    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Filter Berdasarkan Tag</h3>
      <div id="filter-tag-container" class="flex flex-wrap gap-2 mb-4">
        ${uniqueTags
          .map(
            (tag) => `
          <button class="filter-tag ${activeFilters.includes(tag) ? 'active' : ''}" data-tag="${tag}">
            ${tag}
          </button>
        `
          )
          .join('')}
      </div>
      
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Urutkan</h3>
      <div id="sort-button-container" class="flex flex-wrap gap-2 mb-4">
          <button data-sort="rating_desc" class="filter-tag ${currentSortOrder === 'rating_desc' ? 'active' : ''}">Rating Tertinggi</button>
          <button data-sort="title_asc" class="filter-tag ${currentSortOrder === 'title_asc' ? 'active' : ''}">Judul A-Z</button>
          <button data-sort="default" class="filter-tag ${currentSortOrder === 'default' ? 'active' : ''}">Default</button>
      </div>

      <h3 class="text-lg font-semibold text-gray-800 mb-3">Cari Judul</h3>
      <form id="filter-search-form" class="flex">
        <input type="text" id="filter-search-input" placeholder="Cari berdasarkan judul..." class="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary">
        <button type="submit" class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-hover">Cari</button>
      </form>
    </div>
  `;
}


function renderPagination(totalItems, itemsPerPage, currentPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return '';

  let html = '<nav class="pagination">';

  html += `
    <a class="pagination-link ${currentPage === 1 ? 'disabled' : ''}" 
       data-page="${currentPage - 1}">
      &laquo;
    </a>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <a class="pagination-link ${i === currentPage ? 'active' : ''}" 
         data-page="${i}">
        ${i}
      </a>
    `;
  }

  html += `
    <a class="pagination-link ${currentPage === totalPages ? 'disabled' : ''}" 
       data-page="${currentPage + 1}">
      &raquo;
    </a>
  `;

  html += '</nav>';
  return html;
}


function renderComicGrid(comicList) {
  if (comicList.length === 0) {
    return '<p class="text-gray-600">Tidak ada komik yang ditemukan.</p>';
  }
  return `
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      ${comicList.map(renderComicCard).join('')}
    </div>
  `;
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let currentSlideIndex = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      const imageUrl = slides[i].dataset.backgroundImage;

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

  heroSliderInterval = setInterval(() => {
    let nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
  }, 4000);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.dotIndex);
      showSlide(index);
      clearInterval(heroSliderInterval);
      heroSliderInterval = setInterval(() => {
        let nextIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIndex);
      }, 4000);
    });
  });
}

function cleanupPageLogic() {
  if (heroSliderInterval) {
    clearInterval(heroSliderInterval);
    heroSliderInterval = null;
  }
  activeFilters = [];
  currentPage = 1;
  currentPaginator = null;
  currentSortOrder = 'default';
}

function initScrollObserver() {
  const cards = document.querySelectorAll('.fade-in-card');
  if (cards.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0.1,
    }
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
}

function applyFiltersAndRender() {
  const query =
    document.getElementById('filter-search-input')?.value.toLowerCase() || '';

  let filteredComics = comics.filter((comic) => {
    const titleMatch = comic.title.toLowerCase().includes(query);
    const tagsMatch = activeFilters.every((filterTag) =>
      comic.tags.includes(filterTag)
    );
    return titleMatch && tagsMatch;
  });

  if (currentSortOrder === 'rating_desc') {
    filteredComics.sort((a, b) => b.rating - a.rating);
  } else if (currentSortOrder === 'title_asc') {
    filteredComics.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  const totalItems = filteredComics.length;
  const startIndex = (currentPage - 1) * comicsPerPage;
  const endIndex = startIndex + comicsPerPage;
  const comicsToShow = filteredComics.slice(startIndex, endIndex);

  const gridContainer = document.getElementById('comic-grid-container');
  const paginationContainer = document.getElementById('pagination-container');

  if (gridContainer) {
    gridContainer.innerHTML = renderComicGrid(comicsToShow);
  }
  if (paginationContainer) {
    paginationContainer.innerHTML = renderPagination(
      totalItems,
      comicsPerPage,
      currentPage
    );
  }

  const sortButtons = document.querySelectorAll('#sort-button-container .filter-tag');
  sortButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.sort === currentSortOrder);
  });


  initScrollObserver();
}

function createPaginatedPage(title, comicList) {
  const paginator = () => {
    const totalItems = comicList.length;
    const startIndex = (currentPage - 1) * comicsPerPage;
    const endIndex = startIndex + comicsPerPage;
    const comicsToShow = comicList.slice(startIndex, endIndex);

    const gridContainer = document.getElementById('comic-grid-container');
    const paginationContainer = document.getElementById('pagination-container');

    if (gridContainer) gridContainer.innerHTML = renderComicGrid(comicsToShow);
    if (paginationContainer)
      paginationContainer.innerHTML = renderPagination(
        totalItems,
        comicsPerPage,
        currentPage
      );
    initScrollObserver();
  };

  currentPaginator = paginator;
  appContent.innerHTML = `
    <h2 class="text-2xl font-bold text-gray-800 mb-4">${title}</h2>
    <div id="comic-grid-container"></div>
    <div id="pagination-container" class="mt-8"></div>
  `;
  paginator();
}

function renderHomePage() {
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
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Komik Populer</h2>
    ${sliderHTML}
    <h2 class="text-2xl font-bold text-gray-800 mb-1 mt-8">Komik Terbaru</h2>
    <p class="text-gray-600 mb-4">Telusuri 10 komik terbaru yang tersedia di web kami.</p>
    <hr class="mb-4 border-gray-200">
    ${renderComicGrid(latestComics)} 
    ${viewAllButtonHTML} 
  `;

  initHeroSlider();
  initScrollObserver();
}


function renderDaftarKomikPage() {
  const uniqueTags = getAllUniqueTags();
  currentPaginator = applyFiltersAndRender;

  appContent.innerHTML = `
    ${renderFilterBar(uniqueTags)}
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Daftar Komik</h2>
    <div id="comic-grid-container"></div>
    <div id="pagination-container" class="mt-8"></div>
  `;

  document
    .getElementById('filter-search-form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      currentPage = 1;
      applyFiltersAndRender();
    });

  document
    .getElementById('filter-tag-container')
    .addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-tag')) {
        const tag = e.target.dataset.tag;
        e.target.classList.toggle('active');

        if (activeFilters.includes(tag)) {
          activeFilters = activeFilters.filter((t) => t !== tag);
        } else {
          activeFilters.push(tag);
        }
        currentPage = 1;
        applyFiltersAndRender();
      }
    });
  
  document
    .getElementById('sort-button-container')
    .addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tag') && e.target.dataset.sort) {
            currentSortOrder = e.target.dataset.sort;
            currentPage = 1;
            applyFiltersAndRender();
        }
    });


  applyFiltersAndRender();
}

function renderBerwarnaPage() {
  const coloredComics = comics.filter((c) => c.tags.includes('Warna'));
  createPaginatedPage('Komik Berwarna', coloredComics);
}

function renderBookmarkPage() {
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
  const bookmarkedComics = comics.filter((c) => user.bookmarks.includes(c.id));

  if (bookmarkedComics.length === 0) {
    appContent.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Bookmark Saya</h2>
      <p class="text-gray-600">Anda belum memiliki bookmark.</p>
    `;
    return;
  }

  createPaginatedPage('Bookmark Saya', bookmarkedComics);
}

function renderLoginPage() {
  appContent.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h2 id="form-title" class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      <form id="auth-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
        </div>
        <div id="confirm-password-field" class="hidden">
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input type="password" id="confirm-password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
        </div>
        
        <button 
          type="submit" 
          id="submit-button" 
          class="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md 
                 hover:bg-primary-hover transition-all duration-200 
                 transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          Login
        </button>
      </form>
      <p id="toggle-auth" class="mt-4 text-center text-sm text-primary hover:underline cursor-pointer">
        Belum punya akun? Daftar di sini
      </p>
    </div>
  `;

  const toggleLink = document.getElementById('toggle-auth');
  const formTitle = document.getElementById('form-title');
  const submitButton = document.getElementById('submit-button');
  const confirmPasswordField = document.getElementById('confirm-password-field');
  const confirmPasswordInput = document.getElementById('confirm-password');
  let isLoginView = true;

  toggleLink.addEventListener('click', () => {
    isLoginView = !isLoginView;
    if (isLoginView) {
      formTitle.textContent = 'Login';
      submitButton.textContent = 'Login';
      toggleLink.textContent = 'Belum punya akun? Daftar di sini';
      confirmPasswordField.classList.add('hidden');
      confirmPasswordInput.required = false;
    } else {
      formTitle.textContent = 'Sign Up';
      submitButton.textContent = 'Sign Up';
      toggleLink.textContent = 'Sudah punya akun? Login di sini';
      confirmPasswordField.classList.remove('hidden');
      confirmPasswordInput.required = true;
    }
  });

  document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (isLoginView) {
      if (!username || !password) {
        alert('Username dan password harus diisi!');
        return;
      }
      auth.login(username);
      renderNavbar();
      alert('Login Berhasil!');
      window.location.hash = '#akun';
    } else {
      const confirmPassword = document.getElementById('confirm-password').value;
      if (!username || !password || !confirmPassword) {
        alert('Semua field harus diisi!');
        return;
      }
      if (password !== confirmPassword) {
        alert('Password dan konfirmasi password tidak cocok!');
        return;
      }
      auth.login(username);
      renderNavbar();
      alert('Pendaftaran Berhasil!');
      window.location.hash = '#akun';
    }
  });
}

function renderAccountPage() {
  if (!auth.isLoggedIn()) {
    window.location.hash = '#login';
    return;
  }
  const user = auth.getUser();

  appContent.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Akun Saya</h2>
      <p class="text-lg mb-6 text-gray-600">Selamat datang, <strong class="text-primary">${user.username}</strong>!</p>
      
      <button 
        id="logout-button" 
        class="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md 
               hover:bg-red-700 transition-all duration-200 
               transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        Logout
      </button>
    </div>
  `;

  document.getElementById('logout-button').addEventListener('click', () => {
    auth.logout();
    renderNavbar();
    alert('Anda telah logout.');
    window.location.hash = '#home';
  });
}

function renderSearchPage(query) {
  const searchResults = comics.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );
  createPaginatedPage(`Hasil Pencarian untuk: "${query}"`, searchResults);
}

function renderDetailPage(comicId) {
  const comic = comics.find((c) => c.id === comicId);
  if (!comic) {
    appContent.innerHTML = '<p class="text-lg text-center text-red-600 font-semibold mt-10">⚠ Komik tidak ditemukan.</p>';
    return;
  }

  const isBookmarked = auth.isBookmarked(comic.id);

  const tagsHTML = comic.tags
    .map((tag) => `<span class="detail-tag">${tag}</span>`)
    .join('');

  const bookmarkIconSVG = `
    <svg class="w-6 h-6" 
         fill="${isBookmarked ? 'currentColor' : 'none'}" 
         stroke="currentColor" 
         viewBox="0 0 24 24" 
         xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
    </svg>
  `;

  appContent.innerHTML = `
    <a href="#daftar-komik" 
       title="Kembali ke Daftar Komik" 
       class="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-primary transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
    </a>
    
    <hr class="my-4 border-gray-200">
    
    <div class="flex flex-col md:flex-row gap-6 md:gap-8">
      <img src="${
        comic.cover
      }" alt="${comic.title}" 
           class="w-full md:w-64 h-auto object-cover rounded-lg shadow-md border border-gray-200 self-start">
      
      <div class="flex-1">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">${comic.title}</h2>
        <p class="text-lg text-gray-600 mb-4"><strong>Penulis:</strong> ${
          comic.author
        }</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${tagsHTML}
        </div>
        
        <p class="text-gray-700 mb-6">${comic.synopsis}</p>
        
        <button id="bookmark-button" 
                title="${isBookmarked ? 'Hapus dari Bookmark' : 'Tambah ke Bookmark'}" 
                class="bookmark-icon-btn ${isBookmarked ? 'active' : ''}">
          ${bookmarkIconSVG}
        </button>
      </div>
    </div>
    
    <hr class="my-6 border-gray-200">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Daftar Chapter</h3>
    <ul class="border border-gray-200 rounded-lg overflow-hidden">
      ${comic.chapters
        .map(
          (chapter) => `
        <li class="border-b border-gray-200 last:border-b-0">
          <a href="#read/${comic.id}/${chapter.id}" class="block p-3 text-gray-700 hover:bg-gray-50 transition-colors">
            ${chapter.title}
          </a>
        </li>
      `
        )
        .join('')}
    </ul>
  `;

  const bookmarkButton = document.getElementById('bookmark-button');
  const bookmarkIcon = bookmarkButton.querySelector('svg');

  bookmarkButton.addEventListener('click', () => {
    if (!auth.isLoggedIn()) {
      window.location.hash = '#login';
      return;
    }

    const isCurrentlyBookmarked = auth.isBookmarked(comic.id);

    if (isCurrentlyBookmarked) {
      auth.removeBookmark(comic.id);
      bookmarkButton.classList.remove('active');
      bookmarkButton.title = 'Tambah ke Bookmark';
      bookmarkIcon.setAttribute('fill', 'none');
    } else {
      auth.addBookmark(comic.id);
      bookmarkButton.classList.add('active');
      bookmarkButton.title = 'Hapus dari Bookmark';
      bookmarkIcon.setAttribute('fill', 'currentColor');
    }
  });
}

function renderMangaPage() {
  const mangaComics = comics.filter((c) => c.tags.includes('Manga'));
  createPaginatedPage('Manga', mangaComics);
}
function renderManhwaPage() {
  const manhwaComics = comics.filter((c) => c.tags.includes('Manhwa'));
  createPaginatedPage('Manhwa', manhwaComics);
}
function renderManhuaPage() {
  const manhuaComics = comics.filter((c) => c.tags.includes('Manhua'));
  createPaginatedPage('Manhua', manhuaComics);
}

function router() {
  appContent.innerHTML = '<p class="text-center text-gray-500 py-10">Memuat...</p>';

  const path = window.location.hash || '#home';

  cleanupPageLogic();

  setTimeout(() => {
     if (appContent.innerHTML === '<p class="text-center text-gray-500 py-10">Memuat...</p>') {
         appContent.innerHTML = '';
     }

      if (path === '#home') {
        renderHomePage();
      } else if (path === '#daftar-komik') {
        renderDaftarKomikPage();
      } else if (path === '#berwarna') {
        renderBerwarnaPage();
      } else if (path === '#bookmark') {
        renderBookmarkPage();
      } else if (path === '#login') {
        renderLoginPage();
      } else if (path === '#akun') {
        renderAccountPage();
      } else if (path === '#manga') {
        renderMangaPage();
      } else if (path === '#manhwa') {
        renderManhwaPage();
      } else if (path === '#manhua') {
        renderManhuaPage();
      } else if (path.startsWith('#search')) {
        const queryString = path.split('?')[1];
        const params = new URLSearchParams(queryString);
        const query = params.get('q');
        renderSearchPage(query);
      } else if (path.startsWith('#detail/')) {
        const comicId = path.split('/')[1];
        renderDetailPage(comicId);
      } else if (path.startsWith('#read/')) {
        const parts = path.split('/');
        appContent.innerHTML = `<h2 class="text-2xl font-bold text-gray-800">Membaca ${parts[1]} - ${parts[2]}</h2><p class="text-gray-600">(Halaman pembaca akan ada di sini)</p>`;
      } else {
        appContent.innerHTML = '<h2 class="text-2xl font-bold text-center text-red-600 mt-10">🚨 404 - Halaman Tidak Ditemukan 🚨</h2><p class="text-center text-gray-600">Maaf, halaman yang Anda cari tidak ada.</p>';
      }
  }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  router();
});
window.addEventListener('hashchange', router);

let lastScrollY = window.scrollY;
const backToTopBtn = document.getElementById('back-to-top-btn');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY) {
    if (currentScrollY > 100) {
      navbarContainer.classList.add('navbar-hidden');
    }
  } else {
    navbarContainer.classList.remove('navbar-hidden');
  }

  lastScrollY = currentScrollY;

  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

appContent.addEventListener('click', (e) => {
  const paginationLink = e.target.closest('.pagination-link');
  if (!paginationLink || paginationLink.classList.contains('disabled')) {
    return;
  }
  e.preventDefault();

  const page = paginationLink.dataset.page;
  
  if (page) {
    currentPage = parseInt(page);
    if (currentPaginator) {
      currentPaginator();
      window.scrollTo(0, 0);
    }
  }
});