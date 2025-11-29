# KomiKita Client - React Frontend

Frontend application untuk KomiKita platform, dibangun dengan React, Vite, dan TailwindCSS.

## Features

- 🎨 Modern UI dengan TailwindCSS
- ⚡ Fast development dengan Vite HMR
- 🔐 Authentication & Authorization
- 📚 Browse manga/manhwa/manhua
- 🔖 Bookmark favorite comics
- 📖 Reading history
- 🔍 Search & filter
- 📱 Responsive design
- 🌙 Dark mode support

## Tech Stack

- React 19
- Vite 7
- React Router DOM
- TailwindCSS
- Axios
- Lucide React & React Icons

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Build

```bash
npm run build
```

Output: `dist/` folder

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

## Folder Structure

```
src/
├── assets/         # Images, fonts
├── components/     # Reusable components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── pages/          # Page components
├── routes/         # Router configuration
├── services/       # API services
├── styles/         # CSS files
└── utils/          # Utility functions
```
