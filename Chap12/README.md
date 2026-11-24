# Chapter 12: Full-Stack Application (Frontend & Backend)

This project connects the authenticated Express & PostgreSQL backend (`Chap11`) with a modern React 19 frontend (`Chap12/frontend`) built using Vite, Redux Toolkit, and React Router v7.

---

## Architecture Overview

- **Database:** PostgreSQL (Docker container `chap10-postgres` on port `5433`)
- **Backend API:** Express 5 + Prisma 7 + TypeScript (`Chap11` on `http://localhost:8000`)
  - Authentication with `jose` (JWT) & `argon2`
  - Token refresh with HttpOnly cookie rotation
  - Rate limiting & Helmet security headers
  - CORS configured for `http://localhost:5173`
- **Frontend App:** React 19 + TypeScript + Vite (`Chap12/frontend` on `http://localhost:5173`)
  - State management: Redux Toolkit (`authSlice`)
  - Routing: React Router v7 with Protected and Admin route guards
  - API client: Type-safe client with in-memory access token & request deduplication for 401 token refresh
  - Forms & UI: React 19 `useActionState` and optimistic UI updates via `useOptimistic`

---

## How to Run the Full Stack

To run the complete application, start the three layers in order:

### 1. Database (PostgreSQL in Docker)
Ensure Docker Desktop is running, then start the PostgreSQL container:

```powershell
docker start chap10-postgres
```

*(If setting up for the first time, make sure the container is created and migrations are applied in `Chap11` via `npm run db:migrate` and seeded via `npx tsx prisma/seed.ts`.)*

---

### 2. Backend Server (`Chap11`)
Open a terminal for the Express backend:

```powershell
cd C:\Users\mikko\Documents\GitHub\FullStackTypeScript2026\Chap11
npm install            # only needed on initial setup
npm run dev
```

You should see:
```text
Express server running on port 8000
```

---

### 3. Frontend App (`Chap12/frontend`)
Open a second terminal for the React frontend:

```powershell
cd C:\Users\mikko\Documents\GitHub\FullStackTypeScript2026\Chap12\frontend
npm install            # only needed on initial setup
npm run dev
```

The Vite dev server will start:
```text
VITE v8.3.8  ready in ... ms

➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

---

## Test Accounts & Credentials

### Pre-Seeded Admin User
- **Email:** `john@example.com`
- **Password:** `password123`
- *Has access to the `/admin` user management table and can delete any post.*

### Registering a New Account
Go to `http://localhost:5173/register` and enter:
- **Username:** At least 2 characters (must be unique)
- **Email:** Valid email format (must be unique)
- **Password:** At least 8 characters

*(New self-registered accounts are granted the standard `USER` role.)*

---

## Running Frontend Tests

Inside `Chap12/frontend`:

```powershell
npm test               # Runs Vitest unit and component tests
npm run build          # Typechecks (tsc -b) and bundles production build
```
