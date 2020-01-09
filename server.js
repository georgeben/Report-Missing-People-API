/* const dotenv = require('dotenv');

dotenv.config(); */
const mongoose = require('mongoose');
const { dbUrl, port } = require('./config')();
require('newrelic');
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
process.on('SIGINT', () => {
  server.close((error) => {
    if (error) {
      process.exit(error ? 1 : 0);
    }
    logger.log('info', 'Shutting down server');
    mongoose.disconnect()
      .then(() => {
        logger.log('info', 'Successfully disconnected from database');
        process.exit(0);
      })
      .catch((err) => process.exit(err ? 1 : 0));
  });
});
