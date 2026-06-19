const { env, isProd, isDev, isTest } = require('./env');
const { connectDB, disconnectDB } = require('./db');

module.exports = { env, isProd, isDev, isTest, connectDB, disconnectDB };
