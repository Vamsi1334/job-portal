const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const { env, isProd } = require('./config/env');
const logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Behind a proxy (Heroku, Nginx, etc.) so rate limiting and secure cookies work.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Security headers.
app.use(helmet());

// Origins allowed to call the API from a browser with credentials. Built-in
// defaults cover local dev and the deployed frontend; CORS_ORIGIN (comma-
// separated) can add more without a code change.
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://job-portal-sable-sigma.vercel.app',
];
const allowedOrigins = Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...env.CORS_ORIGIN]));

// CORS with credentials so the browser can send the auth cookie.
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header) and any whitelisted origin.
      // Disallowed origins get no CORS headers (browser blocks them) rather than
      // a server error.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);

// Body and cookie parsing.
app.use(express.json({ limit: env.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.BODY_LIMIT }));
app.use(cookieParser());

// Gzip responses.
app.use(compression());

// Request logging.
app.use(morgan(isProd ? 'combined' : 'dev', { stream: logger.stream }));

// Liveness probe (infrastructure, not a feature API).
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

// Rate limit and mount the (currently empty) API under a versioned prefix.
app.use('/api/v1', apiLimiter, routes);

// 404 and global error handling, always last.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
