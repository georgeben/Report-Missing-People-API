const prepare = require('mocha-prepare');
const mongoUnit = require('mongo-unit');
const logger = require('../utils/logger');

prepare(
  (done) => {
    mongoUnit.start()
      .then(() => {
        logger.log('info', `Fake db url ${mongoUnit.getUrl()}`);
        process.env.DEV_DBURL = mongoUnit.getUrl();
        done();
      })
      .catch((error) => {
        logger.log('error', 'An error occurred while setting up test db', error);
      });
  },
  (done) => {
    mongoUnit.stop();
    done();
  },
);
