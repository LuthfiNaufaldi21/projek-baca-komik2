# Manual Testing Checklist - Bookmark & Read History Fix

## ✅ CHANGES MADE

1. **authService.js** - Fixed data transformation:
   - ❌ Before: Converted bookmarks to simple slug array `["slug1", "slug2"]`
   - ✅ Now: Keep full structure `[{id, comic_id, comic: {...}}]`
2. **AuthContext.jsx** - Updated `isBookmarked()`:

   - Check using `bookmark.comic.id` or `bookmark.comic.slug`
   - Handle new database structure properly

3. **Pages already correct**:
   - BookmarkPage: Expects `user.bookmarks.map(b => b.comic)` ✅
   - RiwayatPage: Expects `user.readHistory.map(h => h.comic)` ✅
   - AccountPage: Same structure ✅

---

## 📝 MANUAL TESTING STEPS

### 1. Login

- [ ] Go to http://localhost:5174/login
- [ ] Login with username: `testuser`, password: `password123`
- [ ] Should redirect to home page
- [ ] Check browser console for user data structure

### 2. Test Bookmark Feature

- [ ] Go to any comic detail page (e.g., One Piece)
- [ ] Click "Bookmark" button
- [ ] Check console log - should see "✅ Bookmark toggled successfully"
- [ ] Go to `/bookmark` page
- [ ] Should see the bookmarked comic displayed
- [ ] Should see comic title, cover image, and genres

### 3. Test Read History

- [ ] Click "Baca Sekarang" on any comic
- [ ] Read some pages
- [ ] Go back to home
- [ ] Go to `/riwayat` page
- [ ] Should see the comic you just read
- [ ] Should show "Chapter X" that you last read
- [ ] Click on the chapter link - should redirect to ReaderPage

### 4. Test Account Page

- [ ] Go to `/account` page
- [ ] Should see your profile info
- [ ] Should see "X komik dibookmark"
- [ ] Should see recent read history (last 5 comics)
- [ ] Each history item should show comic title and last read chapter

### 5. Test Type Pages

- [ ] Go to `/manga` - should show Manga comics (capital M)
- [ ] Go to `/manhwa` - should show Manhwa comics (capital M)
- [ ] Go to `/manhua` - should show Manhua comics (capital M)

---

## 🔍 VERIFICATION POINTS

### Check Browser Console Logs:

1. After login, look for:

   ```
   💾 [AuthService] User data saved: {bookmarks: X, history: Y, avatar: ...}
   ```

2. After toggle bookmark, look for:

   ```
   🔖 [AuthService] Toggling bookmark for comic: one-piece
   ✅ [AuthService] Bookmark toggled successfully: Komik berhasil ...
   ```

3. After reading chapter, look for:
   ```
   📖 [AuthService] Updating reading history: {comicSlug: ..., chapterSlug: ...}
   ✅ [AuthService] Reading history updated successfully
   ```

### Check localStorage:

Open browser DevTools → Application → Local Storage → http://localhost:5174

- Check `komikita-user` value
- Should have:
  ```json
  {
    "bookmarks": [
      {"id": 1, "comic_id": 5, "comic": {"id": 5, "slug": "one-piece", "title": "One Piece", ...}}
    ],
    "readHistory": [
      {"id": 1, "comic_id": 5, "chapter_id": "...", "comic": {...}}
    ]
  }
  ```

---

## ❌ KNOWN ISSUES TO CHECK

1. **BookmarkPage empty after fix?**

   - If empty: Check if `user.bookmarks[0].comic` has data
   - Should NOT be string array anymore

2. **isBookmarked() not working?**

   - Check if comic detail page shows correct bookmark state
   - Try toggling bookmark multiple times

3. **RiwayatPage shows undefined?**
   - Check if `historyItem.comic` exists
   - Check chapter parsing logic

---

## 📊 EXPECTED DATABASE STRUCTURE

### Backend returns (from /api/user/profile):

```json
{
  "username": "testuser",
  "bookmarks": [
    {
      "id": 1,
      "comic_id": 5,
      "comic": {
        "id": 5,
        "slug": "one-piece",
        "title": "One Piece",
        "cover_url": "...",
        "genres": [{"id": 1, "name": "Action"}, ...]
      }
    }
  ],
  "readHistory": [
    {
      "id": 1,
      "comic_id": 5,
      "chapter_id": "/baca-chapter/one-piece/chapter-1",
      "read_at": "2025-01-01T00:00:00.000Z",
      "comic": {
        "id": 5,
        "slug": "one-piece",
        "title": "One Piece",
        ...
      }
    }
  ]
}
```

### Frontend expects (same structure):

- `user.bookmarks` = array of bookmark objects with `comic` relation
- `user.readHistory` = array of history objects with `comic` relation

---

## ✨ SUCCESS CRITERIA

- ✅ BookmarkPage shows comics with full details (title, cover, genres)
- ✅ RiwayatPage shows last read chapters correctly
- ✅ AccountPage displays bookmark count and recent history
- ✅ isBookmarked() returns correct state on detail pages
- ✅ Toggle bookmark updates UI immediately after refresh
- ✅ No console errors related to undefined comic objects

---

## 🐛 IF SOMETHING FAILS

1. Check browser console for errors
2. Check server console for API errors
3. Verify database has data:
   ```sql
   SELECT * FROM "Bookmarks" WHERE user_id = 1;
   SELECT * FROM "ReadHistory" WHERE user_id = 1;
   ```
4. Check localStorage structure matches expected format
5. Clear localStorage and login again to reset data
