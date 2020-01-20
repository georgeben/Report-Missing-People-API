
const mongoose = require('mongoose');
const { dbUrl, port } = require('./config')();
require('newrelic');
const redis = require('./config/redis');
const app = require('./app');

const { logger } = require('./utils');

// Connecting to MongoDB
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.log('info', 'Successfully connected to MongoDB');
  })
  .catch((error) => {
    logger.log('error', 'Failed to connect to mongo database', {
      error,
    });
  });

const server = app.listen(port, () => {
  logger.log('info', `Server running on PORT ${port} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
function gracefulShutdown() {
  server.close((error) => {
    if (error) {
      process.exit(error ? 1 : 0);
    }
    logger.log('info', 'Shutting down server');
    mongoose
      .disconnect()
      .then(() => {
        logger.log('info', 'Successfully disconnected from database');
        redis
          .quitAsync()
          .then(() => {
            logger.log('info', 'Successfully disconnected from redis');
            process.exit(0);
          })
          .catch((err) => {
            logger.log('error', 'Failed to close redis connections', err);
            process.exit(1);
          });
      })
      .catch((err) => process.exit(err ? 1 : 0));
  });
}
process.on('SIGINT', () => {
  gracefulShutdown();
});

process.on('SIGTERM', () => {
  gracefulShutdown();
});

module.exports = server;
