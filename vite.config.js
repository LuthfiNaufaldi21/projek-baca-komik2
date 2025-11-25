// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🎯 KODE PERBAIKAN DI SINI
  server: {
    // Nonaktifkan pembukaan browser otomatis
    open: false, 
    // Anda juga bisa menentukan port eksplisit di sini:
    // port: 5173 
  }
})