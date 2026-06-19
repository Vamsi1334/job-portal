# Recruitment Portal Backend

Production-ready Express and MongoDB backend scaffold for the Recruitment Portal. This is the structure only. No API endpoints are defined yet.

## Stack

- Node.js and Express
- MongoDB with Mongoose
- JWT for auth (utility and middleware ready)
- bcrypt for password hashing (utility ready)
- Zod for request validation
- helmet, cors, morgan, compression, cookie-parser
- express-rate-limit
- Global error handling and graceful shutdown

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your env file and set a real `JWT_SECRET`:

   ```bash
   cp .env.example .env
   ```

3. Make sure MongoDB is running locally, then start the server:

   ```bash
   npm run dev
   ```

   The server listens on `http://localhost:5000`. A liveness probe is available at `GET /health`.

The API is mounted at `/api/v1` and currently has no routes.

## Scripts

- `npm run dev` start with nodemon
- `npm start` start with node
- `npm run lint` run ESLint
- `npm run format` format with Prettier

## Environment variables

Validated at startup in `src/config/env.js` with Zod. The process exits if anything is invalid.

| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | Run mode | development |
| `PORT` | HTTP port | 5000 |
| `MONGODB_URI` | Mongo connection string | required |
| `JWT_SECRET` | Token signing secret (16+ chars) | required |
| `JWT_EXPIRES_IN` | Token lifetime | 7d |
| `JWT_COOKIE_EXPIRES_IN` | Cookie lifetime in days | 7 |
| `BCRYPT_SALT_ROUNDS` | Hashing cost | 12 |
| `CORS_ORIGIN` | Allowed browser origin | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX` | Requests per window | 100 |
| `BODY_LIMIT` | Max request body size | 10kb |

## Folder structure

```
src/
  server.js            Entry point: connect DB, start server, handle signals and crashes
  app.js               Express app: security, parsing, logging, routes mount, error handling
  config/
    env.js             Load and validate environment variables (Zod)
    db.js              Mongoose connection with events and graceful close
    index.js           Barrel
  middleware/
    errorHandler.js    Global error handler (maps Mongoose, Mongo, JWT errors)
    notFound.js        404 for unmatched routes
    rateLimiter.js     apiLimiter and stricter authLimiter
    validate.js        Zod validation middleware factory
    auth.js            protect and restrictTo (JWT, role guard)
  routes/
    index.js           Central API router (feature routers mount here later)
  controllers/         Request handlers (empty)
  services/            Business logic and data access (empty)
  models/              Mongoose schemas (empty)
  validators/          Zod request schemas (empty)
  utils/
    ApiError.js        Operational error with status code
    asyncHandler.js    Async wrapper that forwards errors to the handler
    logger.js          Leveled logger with a morgan stream
    jwt.js             signToken and verifyToken
    password.js        hashPassword and comparePassword
  constants/
    index.js           Roles, HTTP status codes, cookie name
```

## Request lifecycle

helmet, then CORS, body and cookie parsing, compression, morgan logging, the rate limiter, then the versioned router. Unmatched routes hit `notFound`, and everything ends at the global `errorHandler`, which returns a consistent JSON shape and hides stack traces in production.

## Conventions for when you add endpoints

- Validate input with a Zod schema in `validators` plus `middleware/validate`.
- Put logic in a `service`; keep controllers thin and wrapped in `asyncHandler`.
- Throw `ApiError` for expected failures so the error handler formats them.
- Protect routes with `protect`, and restrict by role with `restrictTo`.

## Notes

- `bcrypt` compiles a native addon. If install fails on your platform, switch to `bcryptjs` and update `src/utils/password.js` (the API is the same).
- Consider adding `express-mongo-sanitize` and `hpp` before going live for extra input hardening.
