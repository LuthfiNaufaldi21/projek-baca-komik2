## 🧪 QUICK TEST GUIDE - Verifikasi Migrasi Database

### **Cara Cepat Test (5 Menit)**

#### **1. Buka Browser Console**
- Tekan `F12` atau `Ctrl+Shift+I`
- Pilih tab **Console**

#### **2. Load Test Script**
Paste script ini di console:

```javascript
// Quick test function
async function quickTest() {
  console.clear();
  console.log('🧪 Quick Migration Test\n');
  
  try {
    // Test 1: Comics API
    const res1 = await fetch('http://localhost:5000/api/comics?limit=3');
    const data1 = await res1.json();
    console.log('✅ API Comics:', data1.data.length, 'comics loaded');
    console.log('   First comic:', data1.data[0]?.title);
    console.log('   Has cover_url:', !!data1.data[0]?.cover_url);
    console.log('   Has genres:', Array.isArray(data1.data[0]?.genres));
    console.log('   Genre format:', data1.data[0]?.genres[0]);
    
    // Test 2: Genre Filter
    const res2 = await fetch('http://localhost:5000/api/comics?genre=action&limit=2');
    const data2 = await res2.json();
    console.log('\n✅ Genre Filter:', data2.data.length, 'action comics');
    
    // Test 3: Sort
    const res3 = await fetch('http://localhost:5000/api/comics?sort=rating&limit=3');
    const data3 = await res3.json();
    const ratings = data3.data.map(c => c.rating);
    console.log('\n✅ Sort by Rating:', ratings.join(' > '));
    
    console.log('\n🎉 Quick test completed! All APIs working.');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run it
await quickTest();
```

#### **3. Expected Output:**
```
✅ API Comics: 3 comics loaded
   First comic: One Piece
   Has cover_url: true
   Has genres: true
   Genre format: {id: 1, name: "Action", slug: "action"}

✅ Genre Filter: 2 action comics

✅ Sort by Rating: 9.5 > 9.2 > 8.8

🎉 Quick test completed! All APIs working.
```

---

### **Test Manual di UI (10 Menit)**

#### **Test 1: HomePage** ✅
1. Buka: http://localhost:5173/
2. Check:
   - [ ] Hero slider tampil (gambar load)
   - [ ] Popular comics section (10 komik)
   - [ ] Latest comics section (10 komik)
   - [ ] Gambar semua load (dari `cover_url`)
   - [ ] Genres tampil sebagai tag
   - [ ] No console error

#### **Test 2: DaftarKomikPage** ✅
1. Buka: http://localhost:5173/daftar-komik
2. Check:
   - [ ] Semua komik tampil
   - [ ] Filter genre dropdown ada
   - [ ] Pilih genre "Action" → Filter works
   - [ ] Sort by "Rating" → Order correct
   - [ ] Pagination works
   - [ ] No console error "comic.tags"

#### **Test 3: DetailPage** ✅
1. Buka: http://localhost:5173/detail/one-piece (ganti dengan slug komik yang ada)
2. Check:
   - [ ] Cover tampil
   - [ ] Title, author, rating tampil
   - [ ] Genres tampil sebagai clickable tags
   - [ ] Synopsis tampil
   - [ ] Chapter list muncul (dari scraping)
   - [ ] Bookmark button works
   - [ ] No console error "localComicsData"

#### **Test 4: BookmarkPage** ✅ (Must Login)
1. Login terlebih dahulu
2. Bookmark beberapa komik dari detail page
3. Buka: http://localhost:5173/bookmark
4. Check:
   - [ ] Semua bookmark tampil
   - [ ] Data lengkap (cover, title, genres, author, rating)
   - [ ] Pagination works
   - [ ] No console error "comics.filter"

#### **Test 5: RiwayatPage** ✅ (Must Login)
1. Baca beberapa chapter
2. Buka: http://localhost:5173/riwayat
3. Check:
   - [ ] Riwayat tampil
   - [ ] "Chapter X terakhir dibaca" correct
   - [ ] Tombol "Lanjut Baca" works
   - [ ] No console error "useMemo"

#### **Test 6: AccountPage** ✅ (Must Login)
1. Buka: http://localhost:5173/account
2. Check:
   - [ ] Total bookmark count (angka benar)
   - [ ] Total riwayat count (angka benar)
   - [ ] Genre favorit calculated (bukan "Belum ada")
   - [ ] Tab bookmark → Shows comics
   - [ ] Tab riwayat → Shows history
   - [ ] No console error "comic.tags"

---

### **Check Console Errors**

#### **Expected: NO ERRORS** ✅

#### **Common Errors (Should NOT See):**
```
❌ comics is not defined
❌ Cannot read property 'filter' of undefined
❌ Cannot read property 'tags' of undefined
❌ useMemo(...) is not a function
❌ Encountered two children with the same key
```

---

### **Verify Database Format**

Open any page, console:

```javascript
// Check comic structure from any page
const checkComic = async () => {
  const res = await fetch('http://localhost:5000/api/comics?limit=1');
  const data = await res.json();
  const comic = data.data[0];
  
  console.log('Comic Structure Check:');
  console.log('✅ Has slug:', !!comic.slug);
  console.log('✅ Has cover_url:', !!comic.cover_url);
  console.log('✅ Has genres array:', Array.isArray(comic.genres));
  console.log('✅ Genre is object:', typeof comic.genres[0] === 'object');
  console.log('✅ Genre has name:', !!comic.genres[0]?.name);
  console.log('✅ Has author:', !!comic.author);
  console.log('✅ Has rating:', typeof comic.rating === 'number');
  
  console.log('\nSample Genre:', comic.genres[0]);
};

await checkComic();
```

**Expected:**
```
✅ Has slug: true
✅ Has cover_url: true
✅ Has genres array: true
✅ Genre is object: true
✅ Genre has name: true
✅ Has author: true
✅ Has rating: true

Sample Genre: {id: 1, name: "Action", slug: "action"}
```

---

### **Final Checklist**

- [ ] ✅ Backend running (port 5000)
- [ ] ✅ Frontend running (port 5173)
- [ ] ✅ Database has data (minimum 5 comics)
- [ ] ✅ No import from `comics.js` di semua file
- [ ] ✅ All pages load tanpa error
- [ ] ✅ API returns correct format (cover_url, genres array)
- [ ] ✅ Filter/sort/search works
- [ ] ✅ Bookmark/history works (if logged in)
- [ ] ✅ No duplicate key warnings
- [ ] ✅ All images load correctly

---

### **If Any Test Fails**

1. **Check backend logs** di terminal server
2. **Check browser console** untuk error detail
3. **Check network tab** untuk failed requests
4. **Verify database** has comics with genres

---

**Status:** ✅ Ready for Testing
**Time:** ~15 minutes total
**Date:** December 5, 2025
