# REFACTORING DOCUMENTATION - KomiKita

## Tanggal: 5 Desember 2025

## Ringkasan Perubahan

Refactoring total dari skema database JSONB ke skema Relasional dengan strategi Hybrid (Manual Metadata + Auto Chapter) dan penambahan fitur Admin.

---

## 1. PERUBAHAN DATABASE

### Schema Baru (Relasional)
- **users**: id, username, email, password, avatar, **role** ['user'/'admin'], created_at, updated_at
- **comics**: id, slug, title, alternative_title, author, status, cover_url, synopsis, rating, type, last_sync_at, created_at
- **genres**: id, name, slug
- **comic_genres**: comic_id, genre_id (Many-to-Many)
- **bookmarks**: id, user_id, comic_id, created_at
- **read_history**: id, user_id, comic_id, **chapter_slug**, read_at

### Perubahan Utama
- ❌ **HAPUS**: Field `bio`, `readingHistory` (JSONB), `bookmarks` (JSONB) dari tabel users
- ✅ **TAMBAH**: Field `role` di tabel users
- ✅ **BUAT**: Tabel relasional untuk comics, genres, bookmarks, read_history

---

## 2. PERUBAHAN BACKEND (apps/server)

### A. Models Baru
**Lokasi**: `apps/server/models/`

1. **User.js** - Updated (hapus JSONB, tambah role)
2. **Comic.js** - NEW
3. **Genre.js** - NEW
4. **ComicGenre.js** - NEW (pivot table)
5. **Bookmark.js** - NEW
6. **ReadHistory.js** - NEW
7. **index.js** - NEW (initialize associations)

### B. Database Config
**File**: `apps/server/config/db.js`

```javascript
// PENTING: TIDAK menggunakan sync() karena tabel sudah dibuat manual di Supabase
const { initializeAssociations } = require("../models");
initializeAssociations();
```

### C. Seeding Scripts
**Lokasi**: `apps/server/seeders/`

1. **seedGenres.js** - Populate tabel genres
2. **seedComics.js** - Migrate data dari comics.js ke database

**Cara Run**:
```bash
cd apps/server
node seeders/seedGenres.js
node seeders/seedComics.js
```

### D. Controllers (Refactored)

#### authController.js
- ✅ Tambah `role: 'user'` default saat register
- ✅ Include `role` di JWT payload dan response

#### userController.js
- ✅ `getProfile()`: JOIN bookmarks dan readHistory dari tabel relasional
- ✅ `toggleBookmark()`: INSERT/DELETE di tabel `bookmarks` (bukan JSONB)
- ✅ `updateHistory()`: UPSERT di tabel `read_history` (per-chapter)
- ✅ `updateProfile()`: Hapus logika `bio`
- ✅ Parameter berubah: `comicId` → `comicSlug`, `chapterId` → `chapterSlug`

#### detailKomikController.js (Strategi Hybrid)
```javascript
getDetail(slug):
  1. Ambil metadata dari Database (comics + genres)
  2. Scrape chapter list dari Komiku (real-time)
  3. Merge keduanya dan kirim ke frontend
```

### E. Admin Features (NEW)

#### Middleware
**File**: `apps/server/middleware/verifyAdmin.js`
```javascript
// Cek req.user.role === 'admin'
```

#### Controller
**File**: `apps/server/controllers/comicController.js`
- `createComic()` - Buat komik baru (Admin only)
- `updateComic()` - Update metadata komik
- `deleteComic()` - Hapus komik
- `getAllComics()` - List semua komik (Public)

#### Routes
**File**: `apps/server/routes/comicRoutes.js`
```javascript
POST   /api/comics      → createComic (Admin)
PUT    /api/comics/:slug → updateComic (Admin)
DELETE /api/comics/:slug → deleteComic (Admin)
GET    /api/comics      → getAllComics (Public)
```

**Registered di**: `apps/server/index.js`
```javascript
app.use("/api/comics", comicRoutes);
```

---

## 3. PERUBAHAN FRONTEND (apps/client)

### A. Services

#### authService.js
**Perubahan**:
- ✅ Handle response baru dengan relasi (bookmarks/readHistory sebagai array object)
- ✅ Convert format backend → frontend:
  - `bookmarks[].comic.slug` → array of slugs
  - `readHistory[].chapter_slug` → object mapping
- ✅ Tambah field `role` di user data
- ❌ HAPUS: Field `bio`
- ✅ Update function signatures:
  - `toggleBookmark(comicSlug)` - bukan comicId
  - `updateReadingHistory(comicSlug, chapterSlug)` - bukan comicId/chapterId

### B. Components

#### EditProfileModal.jsx
- ❌ HAPUS: Input `bio`
- ❌ HAPUS: Import `FiFileText`
- ✅ Hanya edit `username` (email disabled)

#### AddComicModal.jsx (NEW)
**Lokasi**: `apps/client/src/components/AddComicModal.jsx`

Form input manual untuk admin:
- Slug, Title, Alternative Title, Author
- Type dropdown (Manga/Manhwa/Manhua)
- Status dropdown (Ongoing/Tamat/dll)
- Cover URL, Rating, Synopsis
- Multi-select Genres (checkbox grid)

### C. Pages

#### AccountPage.jsx
- ❌ HAPUS: Display `user.bio`
- ✅ TAMBAH: Badge "ADMIN" jika `user.role === 'admin'`
- ✅ CSS baru: `.account-page__admin-badge`

#### DaftarKomikPage.jsx
- ✅ TAMBAH: Import `AddComicModal` dan `useAuth`
- ✅ TAMBAH: Button "+ Tambah Komik" (hanya visible untuk admin)
- ✅ TAMBAH: State `showAddModal`
- ✅ CSS baru: `.daftar-komik__add-button`

#### DetailPage.jsx
- ✅ Sudah compatible dengan data hybrid dari backend
- ✅ Backend mengirim merged data (metadata DB + chapters scraped)

### D. Styles (NEW/Updated)

#### AccountPage.css
```css
.account-page__title-wrapper { /* flex container */ }
.account-page__admin-badge { /* gradient badge */ }
```

#### DaftarKomikPage.css
```css
.daftar-komik__header { /* flex layout */ }
.daftar-komik__add-button { /* gradient button */ }
```

#### Modal.css (NEW)
```css
.modal-content--wide { /* untuk modal lebar */ }
.genre-grid { /* grid layout untuk genre chips */ }
.genre-chip { /* style chip */ }
.genre-chip--active { /* chip terpilih */ }
```

---

## 4. CARA DEPLOYMENT

### Langkah 1: Setup Database di Supabase
1. Login ke Supabase Dashboard
2. Buka SQL Editor
3. Copy-paste isi file `apps/server/schema/supabase_db.sql`
4. Execute query
5. ✅ Semua tabel, view, index, dan trigger akan dibuat

### Langkah 2: Update Environment Variables
```env
# Backend (.env)
DB_NAME=postgres
DB_USER=postgres.xxxxxxxxxxxxx
DB_PASSWORD=your_supabase_password
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_DIALECT=postgres
DB_PORT=6543
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
```

### Langkah 3: Seed Database
```bash
cd apps/server
npm install
node seeders/seedGenres.js
node seeders/seedComics.js
```

### Langkah 4: Run Backend
```bash
cd apps/server
npm run dev
```

### Langkah 5: Run Frontend
```bash
cd apps/client
npm install
npm run dev
```

---

## 5. TESTING CHECKLIST

### Backend
- [ ] Register user baru → role default 'user'
- [ ] Login user → token berisi role
- [ ] GET /api/user/profile → return bookmarks/readHistory sebagai array relasi
- [ ] POST /api/user/bookmark → toggle bookmark (INSERT/DELETE tabel)
- [ ] POST /api/user/history → update history (UPSERT dengan chapter_slug)
- [ ] GET /detail-komik/:slug → return merged data (DB + scraped)
- [ ] POST /api/comics (dengan token admin) → berhasil create
- [ ] POST /api/comics (tanpa token/bukan admin) → 401/403

### Frontend
- [ ] Login → user.role tersimpan
- [ ] AccountPage → badge ADMIN muncul jika admin
- [ ] AccountPage → bio TIDAK TAMPIL
- [ ] EditProfileModal → field bio TIDAK ADA
- [ ] DaftarKomikPage → button "+ Tambah Komik" hanya visible untuk admin
- [ ] Click "+ Tambah Komik" → modal muncul
- [ ] Submit modal → komik baru muncul di list
- [ ] DetailPage → chapter list muncul (dari scraping)
- [ ] Bookmark → data tersimpan di database relasional

---

## 6. MIGRATION NOTES

### Data Migration
Jika ada data user lama dengan JSONB:
1. Export data bookmarks/history dari kolom JSONB
2. Convert ke format relasional
3. Insert ke tabel bookmarks dan read_history
4. Drop kolom JSONB setelah migrasi sukses

### Breaking Changes
⚠️ **API Changes**:
- `POST /api/user/bookmark`: body `comicId` → `comicSlug`
- `POST /api/user/history`: body `comicId, chapterId` → `comicSlug, chapterSlug`
- `GET /api/user/profile`: response structure berubah (array of objects dengan relasi)

### Backward Compatibility
❌ **Tidak ada** - Frontend harus update bersamaan dengan backend

---

## 7. TROUBLESHOOTING

### Error: "Relation does not exist"
✅ **Solusi**: Jalankan `supabase_db.sql` di Supabase SQL Editor

### Error: "Unable to connect to database"
✅ **Solusi**: Cek env variables (DB_HOST, DB_PASSWORD)

### Error: "Token tidak valid"
✅ **Solusi**: Logout dan login ulang (JWT payload berubah, butuh role)

### Admin button tidak muncul
✅ **Solusi**: 
1. Cek `user.role` di localStorage/console
2. Update manual di Supabase: `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'`

### Bookmark/History tidak tersimpan
✅ **Solusi**:
1. Cek tabel bookmarks/read_history di Supabase
2. Cek console log di authService.js
3. Pastikan comicSlug valid (ada di tabel comics)

---

## 8. FILE STRUCTURE SUMMARY

```
apps/
├── server/
│   ├── config/
│   │   └── db.js                    ✏️ Updated (no sync)
│   ├── controllers/
│   │   ├── authController.js        ✏️ Updated (role)
│   │   ├── userController.js        ✏️ Updated (relational)
│   │   ├── detailKomikController.js ✏️ Updated (hybrid)
│   │   └── comicController.js       ✨ NEW (admin CRUD)
│   ├── middleware/
│   │   ├── auth.js                  ✅ Existing
│   │   └── verifyAdmin.js           ✨ NEW
│   ├── models/
│   │   ├── User.js                  ✏️ Updated
│   │   ├── Comic.js                 ✨ NEW
│   │   ├── Genre.js                 ✨ NEW
│   │   ├── ComicGenre.js            ✨ NEW
│   │   ├── Bookmark.js              ✨ NEW
│   │   ├── ReadHistory.js           ✨ NEW
│   │   └── index.js                 ✨ NEW (associations)
│   ├── routes/
│   │   └── comicRoutes.js           ✨ NEW
│   ├── seeders/
│   │   ├── seedGenres.js            ✨ NEW
│   │   └── seedComics.js            ✨ NEW
│   ├── schema/
│   │   └── supabase_db.sql          📄 Reference
│   └── index.js                     ✏️ Updated (mount comicRoutes)
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── EditProfileModal.jsx ✏️ Updated (remove bio)
    │   │   └── AddComicModal.jsx    ✨ NEW
    │   ├── pages/
    │   │   ├── AccountPage.jsx      ✏️ Updated (admin badge, remove bio)
    │   │   ├── DaftarKomikPage.jsx  ✏️ Updated (admin button)
    │   │   └── DetailPage.jsx       ✅ Compatible
    │   ├── services/
    │   │   └── authService.js       ✏️ Updated (slug-based, remove bio)
    │   └── styles/
    │       ├── AccountPage.css      ✏️ Updated (admin badge)
    │       ├── DaftarKomikPage.css  ✏️ Updated (admin button)
    │       └── Modal.css            ✨ NEW
```

---

## 9. KESIMPULAN

✅ **Berhasil Diselesaikan**:
1. ✅ Skema database relasional (7 tabel)
2. ✅ Model Sequelize dengan asosiasi lengkap
3. ✅ Seeding scripts (genres + comics)
4. ✅ Backend refactoring (JSONB → Relational)
5. ✅ Hybrid strategy (DB metadata + scraped chapters)
6. ✅ Admin features (CRUD comics)
7. ✅ Frontend updates (remove bio, admin UI)
8. ✅ Role-based access control

🎯 **Next Steps**:
1. Deploy ke Supabase + Vercel
2. Testing end-to-end
3. Set admin role manual di database untuk user pertama
4. Monitor performance scraping vs database

---

**Author**: GitHub Copilot  
**Date**: December 5, 2025  
**Version**: 2.0.0 (Relational + Hybrid)
