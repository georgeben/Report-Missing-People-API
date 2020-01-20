/**
 * Configures passport for Facebook OAUTH sign in
 */
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

passport.use(
  'facebook',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    ((accessToken, refreshToken, profile, done) => done(null, profile)),
  ),
);

module.exports = passport;
