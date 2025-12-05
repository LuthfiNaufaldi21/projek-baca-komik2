# 🧪 TEST MIGRATION - Database Integration

## ✅ Testing Checklist

### **Phase 0: Backend API Endpoints**

#### Test 1: Comics List with Filters
```bash
# Terminal test
curl http://localhost:5000/api/comics?limit=10
curl http://localhost:5000/api/comics?sort=rating&limit=10
curl http://localhost:5000/api/comics?sort=created_at&limit=10
curl http://localhost:5000/api/comics?genre=action&limit=10
curl http://localhost:5000/api/comics?search=one&limit=10
```

**Expected:**
- ✅ Returns comics array with `cover_url`, `genres` array, `author`, `rating`, `status`, `slug`
- ✅ Pagination: `{total, page, limit, totalPages, data: [...]}`
- ✅ Each genre is object: `{id, name, slug}`

#### Test 2: User Profile with Relations
```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:**
- ✅ Returns user with `bookmarks` array
- ✅ Each bookmark has `comic` object with full details + genres
- ✅ Returns `readHistory` array
- ✅ Each history has `comic` object with full details

---

### **Phase 1: comicService.js Functions**

Open browser console dan test:

```javascript
// Test 1: Get All Comics
const allComics = await window.comicService.getAllComics();
console.log("All Comics:", allComics);
// ✅ Should return array from database
// ✅ Each comic should have cover_url, genres array

// Test 2: Get by Type
const manga = await window.comicService.getComicsByType('Manga');
console.log("Manga:", manga);
// ✅ Should filter by type

// Test 3: Get by Genre
const action = await window.comicService.getComicsByGenre('action');
console.log("Action Comics:", action);
// ✅ Should filter by genre slug

// Test 4: Search
const search = await window.comicService.searchComics('one');
console.log("Search Results:", search);
// ✅ Should return matching comics

// Test 5: Get by Slug
const comic = await window.comicService.getComicBySlug('one-piece');
console.log("Comic Detail:", comic);
// ✅ Should return single comic or null
```

---

### **Phase 2: UI Components**

#### Test ComicCard
1. **Open:** http://localhost:5173/
2. **Check:** Popular comics section
   - ✅ Images load (from `cover_url`)
   - ✅ Genres display as tags (from `genres[].name`)
   - ✅ Rating shows
   - ✅ Click card → Goes to `/detail/{slug}`

#### Test HeroSlider
1. **Check:** Homepage hero slider
   - ✅ Images load
   - ✅ Genres display (extract from `genres` array)
   - ✅ Click "Baca Sekarang" → Goes to detail page

---

### **Phase 3: DaftarKomikPage**

1. **Open:** http://localhost:5173/daftar-komik
2. **Test Filters:**
   - ✅ Genre dropdown shows all unique genres
   - ✅ Select "Action" → Filters correctly
   - ✅ Select multiple genres → Shows comics matching ALL
   - ✅ No console errors about `comic.tags`
3. **Test Sort:**
   - ✅ Sort by rating → Orders correctly
   - ✅ Sort A-Z → Orders by title
4. **Test Pagination:**
   - ✅ Page navigation works
   - ✅ Shows correct count

---

### **Phase 4: BookmarkPage**

1. **Open:** http://localhost:5173/bookmark (must be logged in)
2. **Test:**
   - ✅ Shows all bookmarked comics
   - ✅ No duplicate ID fetching (no `comics.filter`)
   - ✅ All comic data displays (cover, title, genres, author, rating)
   - ✅ Click comic → Goes to detail
   - ✅ Pagination works

**Console Check:**
```javascript
// Should NOT see:
// - "comics.find is not a function"
// - "Cannot read property 'filter' of undefined"
```

---

### **Phase 5: RiwayatPage**

1. **Open:** http://localhost:5173/riwayat (must be logged in)
2. **Test:**
   - ✅ Shows reading history
   - ✅ "Chapter X terakhir dibaca" displays
   - ✅ "Lanjut Baca" button goes to correct chapter
   - ✅ Comic data complete (not null)
   - ✅ No console errors about `user.readingHistory`

**Console Check:**
```javascript
// Should NOT see:
// - "Cannot read property 'map' of undefined"
// - "useMemo(...) is not a function"
```

---

### **Phase 6: AccountPage**

1. **Open:** http://localhost:5173/account (must be logged in)
2. **Test Statistics:**
   - ✅ Total bookmark count (correct number)
   - ✅ Total riwayat count (correct number)
   - ✅ Genre Favorit (calculated from `genres`, not `tags`)
3. **Test Bookmark Tab:**
   - ✅ Shows bookmarked comics grid
   - ✅ All data displays
4. **Test Riwayat Tab:**
   - ✅ Shows reading history
   - ✅ Chapter info displays
   - ✅ "Lanjut Baca" works

**Console Check:**
```javascript
// Genre favorit logic should use:
comic.genres.forEach(genre => {
  const genreName = genre.name || genre;
  // ...
})
// NOT: comic.tags.forEach(...)
```

---

### **Phase 7: DetailPage**

1. **Open:** http://localhost:5173/detail/one-piece
2. **Test Metadata:**
   - ✅ Cover loads (from `cover_url`)
   - ✅ Title, author, rating display
   - ✅ Genres show as clickable tags
   - ✅ Click genre tag → Goes to `/genre/{slug}`
   - ✅ Synopsis displays
3. **Test Chapters:**
   - ✅ Chapter list loads (from scraping `/detail-komik`)
   - ✅ Click chapter → Goes to reader
   - ✅ Bookmark button works
4. **Test Related Comics:**
   - ✅ Section should NOT display (array is empty)
   - ✅ No error about `localComicsData`

**Console Check:**
```javascript
// Should NOT see:
// - "comics is not defined"
// - "Cannot read property 'filter' of undefined"
```

---

### **Phase 8: Other Pages (Auto-working)**

#### HomePage
1. **Open:** http://localhost:5173/
2. **Test:**
   - ✅ Popular comics (sorted by rating)
   - ✅ Latest comics (sorted by created_at)
   - ✅ Both sections load from database
   - ✅ No duplicate keys warning

#### BerwarnaPage
1. **Open:** http://localhost:5173/berwarna
2. **Test:**
   - ✅ Shows colored comics (genre=warna)
   - ✅ Pagination works

#### MangaPage / ManhwaPage / ManhuaPage
1. **Open:** http://localhost:5173/manga
2. **Test:**
   - ✅ Filters by type
   - ✅ Pagination works

#### GenrePage
1. **Open:** http://localhost:5173/genre/action
2. **Test:**
   - ✅ Shows action comics
   - ✅ Genre name displays
   - ✅ Pagination works

#### SearchPage
1. **Open:** http://localhost:5173/search?q=one
2. **Test:**
   - ✅ Shows search results
   - ✅ Query from database
   - ✅ Pagination works

---

## 🐛 Common Issues to Check

### Issue 1: Duplicate Key Warning
**Error:** `Encountered two children with the same key`
**Check:** All `.map()` should use `key={comic.slug || comic.id}`

### Issue 2: Tags/Genres Undefined
**Error:** `Cannot read property 'map' of undefined`
**Check:** Use `comic.genres?.map()` or `detail?.genres`

### Issue 3: Cover Not Loading
**Check:** Use `cover_url || cover || image || thumbnail`

### Issue 4: useMemo Error
**Error:** `useMemo(...) is not a function`
**Check:** Must have closing `}, [dependencies])`

---

## 📊 Final Verification

Run this in browser console on any page:

```javascript
// Test API is working
const testAPI = async () => {
  console.log("🧪 Testing API Endpoints...");
  
  // 1. Get comics
  const comics = await fetch('http://localhost:5000/api/comics?limit=5')
    .then(r => r.json());
  console.log("✅ Comics API:", comics);
  
  // 2. Check data structure
  const firstComic = comics.data[0];
  console.log("📦 First Comic:", {
    hasSlug: !!firstComic.slug,
    hasCoverUrl: !!firstComic.cover_url,
    hasGenres: Array.isArray(firstComic.genres),
    genreFormat: firstComic.genres[0],
    hasAuthor: !!firstComic.author,
    hasRating: !!firstComic.rating,
  });
  
  return "All checks passed! 🎉";
};

testAPI();
```

**Expected Output:**
```javascript
{
  hasSlug: true,
  hasCoverUrl: true,
  hasGenres: true,
  genreFormat: {id: 1, name: "Action", slug: "action"},
  hasAuthor: true,
  hasRating: true
}
```

---

## ✅ All Tests Pass Criteria

- [ ] No console errors on any page
- [ ] No duplicate key warnings
- [ ] All images load correctly
- [ ] Genres display as names (not objects)
- [ ] Filter/sort/search work correctly
- [ ] Pagination works on all pages
- [ ] Bookmark functionality works
- [ ] Reading history displays correctly
- [ ] Account statistics are accurate
- [ ] Detail page shows all data
- [ ] Chapter list loads (from scraping)
- [ ] No reference to dummy `comics.js`

---

## 🚨 If Tests Fail

**Step 1:** Check browser console for errors
**Step 2:** Check network tab for failed API calls
**Step 3:** Verify backend is running on port 5000
**Step 4:** Check database has data (at least 5-10 comics)
**Step 5:** Report specific error message

---

**Status:** Ready for testing
**Date:** December 5, 2025
**Migration:** Dummy Data → PostgreSQL Database
