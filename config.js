require('dotenv').config();

module.exports = function () {
  switch (process.env.APP_ENV) {
    case 'staging':
      return {
        dbUrl: process.env.STAGING_DBURL,
        port: process.env.PORT,
        logFormat: 'combined',
        algoliaIndex: 'staging_CASES',
        frontEndUrl: 'https://helplookforme-staging.netlify.com',
        baseUrl: process.env.STAGING_BASEURL,
        redisUrl: process.env.REDIS_URL,
        twitterCallbackUrl:
          'https://helplookforme-staging.netlify.com/auth/login/twitter',
        twitterBotUrl: process.env.TWITTER_BOT_STAGING,
        caseFolderName: 'case_photos_staging',
        userFolderName: 'user_photos_staging',
      };
    case 'production':
      return {
        dbUrl: process.env.PROD_DBURL,
        port: process.env.PORT,
        logFormat: 'combined',
        algoliaIndex: 'CASES',
        frontEndUrl: 'http://helplookfor.me',
        baseUrl: process.env.BASE_URL,
        twitterCallbackUrl: 'http://helplookfor.me/auth/login/twitter',
        twitterBotUrl: process.env.TWITTER_BOT,
        caseFolderName: 'case_photos_prod',
        userFolderName: 'user_photos_prod',
      };
    default:
      return {
        dbUrl: process.env.DEV_DBURL,
        port: 3001,
        logFormat: 'dev',
        algoliaIndex: 'dev_CASES',
        frontEndUrl: 'http://localhost:8080',
        baseUrl: process.env.DEV_BASE_URL,
        twitterCallbackUrl: 'http://localhost:8080/auth/login/twitter/',
        twitterBotUrl: process.env.TWITTER_BOT_DEV,
        caseFolderName: 'case_photos',
        userFolderName: 'user_photos',
      };
  }
};
