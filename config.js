require('dotenv').config();

module.exports = function () {
  switch (process.env.APP_ENV) {
    case 'staging':
      return {
        dbUrl: process.env.STAGING_DBURL,
        port: process.env.PORT,
        logFormat: 'combined',
        algoliaIndex: 'staging_CASES',
        frontEndUrl: 'https://helplookforme-staging.netlify.com/#/',
        baseUrl: process.env.STAGING_BASEURL,
        redisUrl: process.env.REDIS_URL,
      };
    case 'production':
      return {
        dbUrl: process.env.PROD_DBURL,
        port: process.env.PORT,
        logFormat: 'combined',
        algoliaIndex: 'CASES',
        frontEndUrl: 'http://localhost:8080',
        baseUrl: process.env.BASE_URL,
      };
    default:
      return {
        dbUrl: process.env.DEV_DBURL,
        port: 3001,
        logFormat: 'dev',
        algoliaIndex: 'dev_CASES',
        frontEndUrl: 'http://localhost:8080',
        baseUrl: process.env.DEV_BASE_URL,
      };
  }
};
