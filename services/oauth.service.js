const { OAuth2Client } = require('google-auth-library');
const twitterSignIn = require('twittersignin');
const Twit = require('twit');
const redis = require('../config/redis');

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

const signInWithTwitter = twitterSignIn({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
});

/**
 * Retrieves the user's google profile information
 * @param {String} id_token - The ID token
 * @returns {Object} payload - The user's google data
 */
async function verifyGoogleIDToken(id_token) {
  const { CLIENT_ID } = process.env;
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

/**
 * Retreives the request token from the Twitter API, necessary
 * for Twitter sign in
 * @returns {String} requestToken - The request token
 */
async function getTwitterRequestToken() {
  const response = await signInWithTwitter.getRequestToken();
  const {
    oauth_token: requestToken,
    oauth_token_secret: requestTokenSecret,
    oauth_callback_confirmed: requestTokenCallbackConfirmed,
  } = response;
  if (requestTokenCallbackConfirmed !== true) {
    return false;
  }
  // Store the requestTokenSecret in the cache
  redis.set(`token-${requestToken}`, requestTokenSecret, 'EX', 5 * 60);
  return requestToken;
}

/**
 * Retreives the user's twitter profile data
 * @param {String} requestToken - The request token
 * @param {String} oauthVerifier - OAuth verifier issued by twitter
 * @returns {Object} user - The user's twitter data
 */
async function getTwitterUserData(requestToken, oauthVerifier) {
  const requestTokenSecret = await redis.get(`token-${requestToken}`);
  const response = await signInWithTwitter.getAccessToken(
    requestToken,
    requestTokenSecret,
    oauthVerifier,
  );
  const {
    oauth_token: accessToken,
    oauth_token_secret: accessTokenSecret,
  } = response;
  const user = signInWithTwitter.getUser(accessToken, accessTokenSecret, { include_email: true });
  return user;
}

module.exports = {
  verifyGoogleIDToken,
  getTwitterRequestToken,
  getTwitterUserData,
};
