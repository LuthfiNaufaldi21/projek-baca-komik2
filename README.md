# KomiKita - Fullstack Comic Reading Platform

Sebuah platform fullstack untuk membaca komik/manga/manhwa/manhua dengan fitur bookmark, riwayat baca, dan autentikasi pengguna.

## 📁 Struktur Monorepo

```
projek-baca-komik2/
├── apps/
│   ├── client/          # Frontend React + Vite
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   └── server/          # Backend Express.js API
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── public/
│       ├── index.js
│       └── package.json
├── package.json         # Root workspace configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL database

### Installation

1. Clone repository:

```bash
git clone <repository-url>
cd projek-baca-komik2
```

2. Install semua dependencies:

```bash
npm install
```

3. Setup environment variables:

```bash
# Copy file .env.example di apps/server/ menjadi .env
cp apps/server/.env.example apps/server/.env
```

4. Konfigurasi database di `apps/server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=komikita_db
DB_USER=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
PORT=3001
```

### Development

Jalankan client dan server secara bersamaan:

```bash
npm run dev
```

Atau jalankan secara terpisah:

```bash
# Client (Frontend) - http://localhost:5173
npm run dev:client

# Server (Backend) - http://localhost:3001
npm run dev:server
```

### Build untuk Production

Build semua aplikasi:

```bash
npm run build
```

Build individual:

```bash
npm run build:client
npm run build:server
```

## 📦 Tech Stack

### Frontend (Client)

- React 19
- React Router DOM
- Vite
- TailwindCSS
- Lucide React Icons
- Axios

### Backend (Server)

- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Bcrypt
- Multer (file upload)
- Cheerio (web scraping)
- Swagger UI (API documentation)

## 🔧 Scripts Available

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Jalankan client & server dalam mode development |
| `npm run dev:client`   | Jalankan hanya client                           |
| `npm run dev:server`   | Jalankan hanya server                           |
| `npm run build`        | Build semua aplikasi                            |
| `npm run build:client` | Build client untuk production                   |
| `npm run start:client` | Preview client production build                 |
| `npm run start:server` | Start server production                         |
| `npm run lint`         | Lint semua workspace                            |
| `npm run clean`        | Hapus semua node_modules dan dist               |

## 📝 API Documentation

Setelah server berjalan, akses dokumentasi API di:

```
http://localhost:3001/api-docs
```

## 🌐 Deployment

### Client (Frontend)

Deploy ke Vercel, Netlify, atau hosting static lainnya:

```bash
cd apps/client
npm run build
# Upload folder dist/ ke hosting
```

### Server (Backend)

Deploy ke Vercel, Railway, Render, atau VPS:

**Vercel:**

- File `vercel.json` sudah tersedia di `apps/server/`
- Deploy dari folder `apps/server/`

**Railway/Render:**

- Set root directory ke `apps/server`
- Build command: `npm install`
- Start command: `npm start`

## 📄 Environment Variables

### Client (.env di apps/client/)

```env
VITE_API_URL=http://localhost:3001/api
```

### Server (.env di apps/server/)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=komikita_db
DB_USER=postgres
DB_PASSWORD=password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

PORT=3001
NODE_ENV=development
```

## 🤝 Contributing

Contributions, issues, dan feature requests are welcome!

## 📜 License

ISC License

---

Made with ❤️ by KomiKita Team
