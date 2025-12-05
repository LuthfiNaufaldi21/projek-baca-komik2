# Dokumentasi Upload Avatar dengan Supabase Storage

## Perubahan yang Dilakukan

### 1. File Baru
- **`apps/server/config/supabase.js`**: Konfigurasi Supabase client menggunakan credentials dari `.env`

### 2. File yang Dimodifikasi
- **`apps/server/controllers/userController.js`**:
  - Mengganti `multer.diskStorage` dengan `multer.memoryStorage`
  - Menghapus dependency `fs` (tidak lagi diperlukan)
  - Mengubah fungsi `uploadAvatar` untuk upload ke Supabase Storage bucket "avatars"
  - Mengubah fungsi `removeAvatar` untuk menghapus dari Supabase Storage
  - Mengubah fungsi `deleteAccount` untuk menghapus avatar dari Supabase Storage

## Cara Kerja

### Upload Avatar
1. File diterima melalui multer dengan memory storage
2. File di-upload ke Supabase Storage bucket "avatars" dengan nama `user-{userId}-{timestamp}.{ext}`
3. Public URL didapatkan dari Supabase
4. Avatar lama (jika ada) dihapus dari Supabase Storage
5. URL avatar baru disimpan ke database

### Remove Avatar
1. Mengambil nama file dari URL avatar user
2. Menghapus file dari Supabase Storage bucket "avatars"
3. Set avatar user ke null di database

### Delete Account
1. Mengambil nama file dari URL avatar user (jika ada)
2. Menghapus file dari Supabase Storage bucket "avatars"
3. Menghapus user dari database

## Konfigurasi Supabase Storage

Pastikan bucket "avatars" sudah dibuat di Supabase dengan konfigurasi:
- **Public bucket**: Ya (agar URL public bisa diakses)
- **File size limit**: 2MB (sesuai dengan limit di multer)
- **Allowed MIME types**: image/jpeg, image/jpg, image/png

## Environment Variables

Pastikan `.env` di folder server memiliki:
```env
SUPABASE_URL=https://sohfffbiknllujnotzyi.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Testing

Untuk testing:
1. Login ke aplikasi
2. Upload avatar melalui Account Page
3. Cek di Supabase Dashboard > Storage > avatars bahwa file ter-upload
4. Avatar harus tampil di UI dengan URL dari Supabase
5. Test remove avatar - file harus terhapus dari Supabase Storage
