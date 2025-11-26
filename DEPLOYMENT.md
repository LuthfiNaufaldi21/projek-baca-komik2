# Deployment Guide

## Frontend (Client) Deployment

### Vercel

1. Push code ke GitHub
2. Import project ke Vercel
3. Set root directory: `apps/client`
4. Build settings akan auto-detect dari package.json
5. Add environment variables di Vercel dashboard:
   - `VITE_API_URL`: URL backend API Anda

### Netlify

1. Push code ke GitHub
2. Import project ke Netlify
3. Build settings:
   - Base directory: `apps/client`
   - Build command: `npm run build`
   - Publish directory: `apps/client/dist`
4. Environment variables:
   - `VITE_API_URL`: URL backend API

## Backend (Server) Deployment

### Vercel

1. Push code ke GitHub
2. Import project baru ke Vercel
3. Set root directory: `apps/server`
4. Add environment variables (DB_HOST, DB_PORT, etc.)
5. Deploy

### Railway

1. Push code ke GitHub
2. New Project -> Deploy from GitHub
3. Settings:
   - Root directory: `apps/server`
   - Start command: `npm start`
4. Add environment variables
5. Deploy

### Render

1. Push code ke GitHub
2. New Web Service -> Connect repository
3. Settings:
   - Root directory: `apps/server`
   - Build command: `npm install`
   - Start command: `npm start`
4. Environment variables
5. Deploy

## Environment Variables

### Client (.env)

```
VITE_API_URL=https://your-backend-url.com
```

### Server (.env)

```
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=komikita_db
DB_USER=your-user
DB_PASSWORD=your-password
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
```

## Database Setup

Pastikan database PostgreSQL sudah ready sebelum deploy backend.

### Options:

- **Vercel Postgres**: Integrated dengan Vercel
- **Railway PostgreSQL**: Add-on di Railway
- **Supabase**: Free PostgreSQL dengan dashboard
- **ElephantSQL**: Free tier available
- **Render PostgreSQL**: Built-in database service

## Post-Deployment

1. Test API endpoints
2. Update CORS settings di backend untuk allow frontend domain
3. Test frontend dapat connect ke backend
4. Monitor logs untuk errors
