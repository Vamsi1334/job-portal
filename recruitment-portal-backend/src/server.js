const app = require('./app');
const { env } = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const logger = require('./utils/logger');

let server;

async function start() {
  try {
    await connectDB();
    server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (err) {
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Close the HTTP server and database connection, then exit.
 */
async function shutdown(signal) {
  logger.warn(`${signal} received. Shutting down.`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Force exit if connections do not close in time.
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    await disconnectDB();
    process.exit(0);
  }
}

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
  logger.error(err.stack || '');
  process.exit(1);
});

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

start();
