const dotenv = require('dotenv');

dotenv.config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3001;
const { DEV_DBURL, PROD_DBURL, NODE_ENV } = process.env;
const { logger } = require('./utils');

let DB_URL;
if (NODE_ENV === 'production') {
  DB_URL = PROD_DBURL;
} else {
  DB_URL = DEV_DBURL;
}

// Connecting to MongoDB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(res => {
    logger.log('info', 'Successfully connected to MongoDB');
  })
  .catch(error => {
    // TODO: Handle error
    logger.log('error', 'Failed to connect to mongo database', {
      error,
    });
  });

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
