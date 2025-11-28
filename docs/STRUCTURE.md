# Struktur Folder KomiKita Monorepo

## Overview

Monorepo ini berisi frontend (client) dan backend (server) dalam satu repository dengan workspace management.

## Struktur Lengkap

```
projek-baca-komik2/
│
├── apps/                                 # Aplikasi utama
│   │
│   ├── client/                          # Frontend React
│   │   ├── public/                      # Static assets
│   │   │   ├── favicon.svg
│   │   │   └── logo.svg
│   │   │
│   │   ├── src/                         # Source code
│   │   │   ├── assets/                  # Images, fonts, etc
│   │   │   │   └── images/
│   │   │   │
│   │   │   ├── components/              # Reusable components
│   │   │   │   ├── BackToTop.jsx
│   │   │   │   ├── ChangePasswordModal.jsx
│   │   │   │   ├── ComicCard.jsx
│   │   │   │   ├── EditProfileModal.jsx
│   │   │   │   ├── FilterBar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── HeroSlider.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   └── UploadAvatarModal.jsx
│   │   │   │
│   │   │   ├── contexts/                # React contexts
│   │   │   │   ├── AuthContext.jsx
│   │   │   │   └── ThemeContext.jsx
│   │   │   │
│   │   │   ├── data/                    # Static data
│   │   │   │   ├── chapterImages.js
│   │   │   │   └── comics.js
│   │   │   │
│   │   │   ├── hooks/                   # Custom hooks
│   │   │   │   ├── useAuth.js
│   │   │   │   ├── useScrollToTop.js
│   │   │   │   └── useTheme.js
│   │   │   │
│   │   │   ├── pages/                   # Page components
│   │   │   │   ├── AccountPage.jsx
│   │   │   │   ├── BerwarnaPage.jsx
│   │   │   │   ├── BookmarkPage.jsx
│   │   │   │   ├── DaftarKomikPage.jsx
│   │   │   │   ├── DetailPage.jsx
│   │   │   │   ├── GenrePage.jsx
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── MangaPage.jsx
│   │   │   │   ├── ManhuaPage.jsx
│   │   │   │   ├── ManhwaPage.jsx
│   │   │   │   ├── ReaderPage.jsx
│   │   │   │   ├── RiwayatPage.jsx
│   │   │   │   └── SearchPage.jsx
│   │   │   │
│   │   │   ├── routes/                  # Router config
│   │   │   │   └── router.jsx
│   │   │   │
│   │   │   ├── services/                # API services
│   │   │   │   ├── api.js
│   │   │   │   ├── authService.js
│   │   │   │   ├── comicService.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── styles/                  # CSS files
│   │   │   │   ├── AccountPage.css
│   │   │   │   ├── BackToTop.css
│   │   │   │   ├── BookmarkPage.css
│   │   │   │   ├── CategoryPage.css
│   │   │   │   ├── ChangePasswordModal.css
│   │   │   │   ├── ComicCard.css
│   │   │   │   ├── DaftarKomikPage.css
│   │   │   │   ├── DetailPage.css
│   │   │   │   ├── EditProfileModal.css
│   │   │   │   ├── FilterBar.css
│   │   │   │   ├── Footer.css
│   │   │   │   ├── GenrePage.css
│   │   │   │   ├── HeroSlider.css
│   │   │   │   ├── HomePage.css
│   │   │   │   ├── LoginPage.css
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── Pagination.css
│   │   │   │   ├── ReaderPage.css
│   │   │   │   ├── RiwayatPage.css
│   │   │   │   ├── SearchPage.css
│   │   │   │   └── UploadAvatarModal.css
│   │   │   │
│   │   │   ├── utils/                   # Utility functions
│   │   │   │   └── constants.js
│   │   │   │
│   │   │   ├── App.css                  # Global app styles
│   │   │   ├── App.jsx                  # Main app component
│   │   │   ├── index.css                # Global CSS
│   │   │   └── main.jsx                 # Entry point
│   │   │
│   │   ├── .env.example                 # Environment template
│   │   ├── .gitignore
│   │   ├── eslint.config.js             # ESLint configuration
│   │   ├── index.html                   # HTML template
│   │   ├── package.json                 # Dependencies
│   │   ├── postcss.config.js            # PostCSS config
│   │   ├── README.md                    # Client documentation
│   │   ├── tailwind.config.js           # TailwindCSS config
│   │   ├── vercel.json                  # Vercel deployment
│   │   └── vite.config.js               # Vite configuration
│   │
│   └── server/                          # Backend Express.js
│       ├── config/                      # Configuration
│       │   └── db.js                    # Database config
│       │
│       ├── controllers/                 # Business logic
│       │   ├── authController.js
│       │   ├── bacaChapterController.js
│       │   ├── berwarnaController.js
│       │   ├── detailKomikController.js
│       │   ├── genreAllController.js
│       │   ├── genreDetailController.js
│       │   ├── genreRekomendasiController.js
│       │   ├── komikPopulerController.js
│       │   ├── pustakaController.js
│       │   ├── rekomendasiController.js
│       │   ├── searchController.js
│       │   ├── terbaruControllers.js
│       │   └── userController.js
│       │
│       ├── middleware/                  # Express middlewares
│       │   ├── auth.js                  # JWT authentication
│       │   └── rateLimiter.js           # Rate limiting
│       │
│       ├── models/                      # Database models
│       │   └── User.js                  # User model
│       │
│       ├── public/                      # Static files
│       │   └── uploads/                 # User uploads
│       │       └── .gitkeep
│       │
│       ├── routes/                      # API routes
│       │   ├── authRoutes.js
│       │   ├── baca-chapter.js
│       │   ├── berwarna.js
│       │   ├── detail-komik.js
│       │   ├── genre-all.js
│       │   ├── genre-detail.js
│       │   ├── genre-rekomendasi.js
│       │   ├── komik-populer.js
│       │   ├── pustaka.js
│       │   ├── rekomendasi.js
│       │   ├── search.js
│       │   ├── terbaru.js
│       │   └── userRoutes.js
│       │
│       ├── img/                         # Documentation images
│       │
│       ├── .env                         # Environment variables (gitignored)
│       ├── .env.example                 # Environment template
│       ├── .gitignore
│       ├── app.js                       # (Currently empty)
│       ├── index.js                     # Server entry point
│       ├── package.json                 # Dependencies
│       ├── README.md                    # Server documentation
│       └── vercel.json                  # Vercel deployment
│
├── .vscode/                             # VSCode settings
│   ├── extensions.json                  # Recommended extensions
│   └── settings.json                    # Workspace settings
│
├── .gitignore                           # Global gitignore
├── DEPLOYMENT.md                        # Deployment guide
├── package.json                         # Root workspace config
├── package-lock.json                    # Lock file
├── README.md                            # Main documentation
└── STRUCTURE.md                         # This file

```

## Penjelasan Struktur

### Root Level

- **apps/**: Berisi semua aplikasi (client & server)
- **.vscode/**: Konfigurasi workspace VSCode
- **package.json**: Konfigurasi workspace dan scripts monorepo
- **DEPLOYMENT.md**: Panduan deployment
- **README.md**: Dokumentasi utama

### Frontend (apps/client/)

- **src/components/**: Komponen React yang reusable
- **src/pages/**: Komponen halaman penuh
- **src/contexts/**: React Context untuk state management
- **src/services/**: API integration layer
- **src/hooks/**: Custom React hooks
- **src/styles/**: File CSS per component
- **public/**: Assets static (favicon, logo)

### Backend (apps/server/)

- **controllers/**: Business logic dan handler
- **routes/**: Route definitions
- **middleware/**: Express middlewares (auth, rate limit)
- **models/**: Sequelize database models
- **config/**: Database dan app configuration
- **public/uploads/**: User uploaded files (avatars)

## Best Practices

### Client

- Komponen dalam `components/` harus reusable
- Setiap page memiliki CSS file sendiri di `styles/`
- API calls melalui `services/` layer
- State global menggunakan Context API
- Environment variables prefix dengan `VITE_`

### Server

- Setiap route memiliki controller sendiri
- Business logic dalam controllers, bukan routes
- Middleware untuk cross-cutting concerns
- Models untuk database schema
- Environment variables dalam `.env`

### Monorepo

- Dependencies diinstall per workspace
- Root package.json untuk scripts yang menjalankan multiple apps
- Shared dependencies bisa di-hoist ke root (optional)

## Scripts

Lihat `package.json` di root untuk list lengkap scripts yang tersedia.
