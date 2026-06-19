/**
 * Minimal leveled logger. Swap for winston or pino later without changing
 * call sites. Morgan writes through the http() stream below.
 */
const ts = () => new Date().toISOString();

const logger = {
  info: (msg) => console.log(`[${ts()}] INFO  ${msg}`),
  warn: (msg) => console.warn(`[${ts()}] WARN  ${msg}`),
  error: (msg) => console.error(`[${ts()}] ERROR ${msg}`),
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') console.debug(`[${ts()}] DEBUG ${msg}`);
  },
  // Stream adapter for morgan.
  stream: {
    write: (message) => console.log(message.trim()),
  },
};

module.exports = logger;
