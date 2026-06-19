const mongoose = require('mongoose');

const { env, isProd } = require('./env');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB. Resolves once connected, rejects on the first failure so
 * the caller can decide whether to exit the process.
 */
async function connectDB() {
  mongoose.set('strictQuery', true);
  if (!isProd) {
    mongoose.set('debug', false);
  }

  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  return mongoose.connection;
}

/**
 * Close the connection cleanly during shutdown.
 */
async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}

module.exports = { connectDB, disconnectDB };
