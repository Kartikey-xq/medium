# Blogify — Medium-style blogging app

Live: https://medium-lyart-ten.vercel.app

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│          React + TypeScript + Vite (Vercel)             │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTP/JSON  (fetch + JWT header)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                           │
│         Hono on Cloudflare Workers (Edge Runtime)       │
│                                                         │
│  Routes:                                                │
│    GET  /api/v1/health          ← health check          │
│    POST /api/v1/auth/signup     ← create account        │
│    POST /api/v1/auth/signin     ← JWT login             │
│    GET  /api/v1/posts           ← list all posts        │
│    POST /api/v1/posts           ← create post (auth)    │
│    GET  /api/v1/posts/:id       ← single post           │
│                                                         │
│  Middleware:                                            │
│    JWT verification (Hono/jwt)                          │
│    Zod request validation (via common/)                 │
└──────────────────────┬──────────────────────────────────┘
                       │  Prisma Client (connection pooling)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                      DATABASE                           │
│         PostgreSQL — Neon / Supabase (serverless)       │
└─────────────────────────────────────────────────────────┘
```

### Package layout

```
medium/
├── backend/          # Hono worker — API + business logic
│   ├── src/
│   │   └── index.ts  # Entry point, route registration
│   ├── prisma/
│   │   └── schema.prisma
│   ├── wrangler.toml # Cloudflare Workers config
│   └── package.json
│
├── frontend/         # React SPA — deployed to Vercel
│   ├── src/
│   └── package.json
│
└── common/           # Shared Zod schemas + TS types
    └── src/
        └── index.ts  # Exported validators (signupInput, etc.)
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string — use the **pooled** URL from Neon/Supabase |
| `JWT_SECRET` | ✅ | Secret used to sign/verify JWTs. Use a long random string. |

> For Cloudflare Workers, secrets are set via `wrangler secret put JWT_SECRET` — they do **not** live in `.env` at runtime. The `.env` file is for local development only.

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | ✅ | Full URL of the deployed worker, e.g. `https://api.your-worker.workers.dev` |

---

## Deployment Targets

| Layer | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Auto-deploy from `main`. Build: `cd frontend && npm run build` |
| Backend | **Cloudflare Workers** | `cd backend && npx wrangler deploy` |
| Database | **Neon** or **Supabase** | Use the **pooled connection string** for Workers (no persistent TCP) |

### Deploy backend

```bash
cd backend
npx wrangler secret put JWT_SECRET    # set prod secret
npx wrangler secret put DATABASE_URL  # set pooled DB URL
npx wrangler deploy
```

### Deploy frontend

Push to `main`. Vercel picks it up automatically. Set `VITE_BACKEND_URL` in the Vercel dashboard under Project → Settings → Environment Variables.

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/kartikey-xq/medium
cd medium

# 2. Install all deps
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd common && npm install && cd ..

# 3. Copy and fill env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Push Prisma schema to your dev DB
cd backend && npx prisma db push

# 5. Start backend (local Wrangler dev server)
cd backend && npx wrangler dev

# 6. Start frontend (separate terminal)
cd frontend && npm run dev
```

---

## API Response Envelope

All API responses follow a consistent JSON envelope:

**Success**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "error": "Human-readable message"
}
```

---

## Future Improvements

- Comments on posts
- Post likes / reactions
- Pagination (`cursor`-based) for the posts list
- Improved auth security (refresh tokens, token rotation)
- Draft vs published post states
