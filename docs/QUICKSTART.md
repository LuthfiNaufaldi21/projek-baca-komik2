# 🚀 Quick Start Guide - KomiKita

## Prerequisites Checklist

- ✅ Node.js >= 18.x installed
- ✅ PostgreSQL database ready
- ✅ npm >= 9.x installed

## Setup Steps (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies for both client and server.

### 2. Configure Environment

Create `.env` file in `apps/server/` directory:

```bash
# Copy the example file
cp apps/server/.env.example apps/server/.env

# Or manually create apps/server/.env with:
```

```env
# Database Configuration (Supabase or local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=komikita_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

# Server Configuration
PORT=5000
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Optional:** Create `apps/client/.env` to override API URL:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

This will start:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

## Verify Everything Works

1. ✅ Open http://localhost:5173 - Frontend should load
2. ✅ Open http://localhost:5000/api-docs - Swagger docs should load
3. ✅ Check terminal - Both servers should be running without errors
4. ✅ Database connection - Should see "✅ PostgreSQL Connection has been established successfully"

## Common Issues & Solutions

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in apps/server/.env
PORT=5001
```

### Issue: Database Connection Failed

**Error:** `Unable to connect to the database`

**Solution:**

1. Check PostgreSQL is running
2. Verify credentials in `apps/server/.env`
3. Make sure database exists:
   ```sql
   CREATE DATABASE komikita_db;
   ```

### Issue: Cannot GET /api/...

**Error:** Frontend can't connect to backend

**Solution:**

1. Check `VITE_API_URL` in `apps/client/.env` matches backend port
2. Default should be: `http://localhost:5000`

## Development Commands

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm run dev`        | Start both client & server |
| `npm run dev:client` | Start only frontend        |
| `npm run dev:server` | Start only backend         |
| `npm run build`      | Build for production       |
| `npm run lint`       | Run ESLint                 |

## Next Steps

1. 📖 Read full documentation: [README.md](README.md)
2. 🚀 Learn deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
3. 📁 Understand structure: [STRUCTURE.md](STRUCTURE.md)
4. 🔧 Explore API: http://localhost:5000/api-docs

## Quick Database Setup (Supabase - Recommended for Development)

1. Create free account at https://supabase.com
2. Create new project
3. Get connection details from Settings → Database
4. Update `apps/server/.env`:

```env
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_USER=postgres.xxxxxxxxxxxxx
DB_PASSWORD=your_supabase_password
DB_NAME=postgres
DB_PORT=6543
```

## Testing the API

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

**Need Help?** Check the full [README.md](README.md) or create an issue on GitHub.
