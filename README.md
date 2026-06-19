# Recruitment Portal (full stack)

This bundle contains everything: the Next.js frontend, the Express and MongoDB backend, and a single-file HTML preview of the UI.

## What is inside

```
recruitment-portal/            Next.js 15 frontend (TypeScript, Tailwind, React Query, Axios)
recruitment-portal-backend/    Express + MongoDB + Mongoose backend (JWT auth, bcrypt, cookies)
recruitment-portal-app.html    Single-file HTML version of the UI (open in a browser, UI only)
```

The HTML file is a static preview of the screens and is not connected to the backend. The real, API-connected app is the Next.js frontend talking to the backend.

## Prerequisites

- Node.js 18 or newer
- A running MongoDB at mongodb://127.0.0.1:27017 (local install or Docker)

## 1) Run the backend

```bash
cd recruitment-portal-backend
npm install
cp .env.example .env          # then set a real JWT_SECRET (16+ characters)
npm run dev                   # http://localhost:5000
```

You should see "MongoDB connected" then "Server listening on port 5000". The API is mounted at /api/v1, and there is a health check at GET /health. Auth endpoints live under /api/v1/auth (register, verify-otp, login, refresh, logout, forgot-password, reset-password, account, me).

No email provider is wired up, so OTP and password reset codes are printed to the backend logs (and returned as a devCode in non-production responses) for testing.

## 2) Run the frontend

```bash
cd recruitment-portal
npm install
cp .env.example .env.local     # defaults already point at the backend
npm run dev                    # http://localhost:3000
```

The frontend proxies /api to the backend (see next.config.ts), so the auth cookies are first-party and there is no CORS to configure. Defaults: NEXT_PUBLIC_API_URL=/api/v1 and BACKEND_INTERNAL_URL=http://localhost:5000.

## 3) Test the flow

Open http://localhost:3000, create an account, then enter the 6 digit code from the backend logs on the verify screen. Verifying logs you in. Try sign out, sign in, visiting /candidates or /applications while logged out (you will be redirected to /login), and the forgot or reset password flow.

## Notes

- node_modules are not included. Run npm install in each folder.
- Do not commit your real .env. Only .env.example is included.
- bcrypt builds a native addon. If install fails on your platform, switch to bcryptjs in recruitment-portal-backend/src/utils/password.js (same API).
