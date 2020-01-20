/**
 * Route for authentication
 */
const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { authController } = require(path.join(HOME_DIR, 'controllers'));
const { checkAuth, validate } = require(path.join(HOME_DIR, 'middlewares'));
const schemas = require(path.join(HOME_DIR, 'schemas'));
const passport = require(path.join(HOME_DIR, 'config', 'passport.js'));

router.post('/signup', validate(schemas.signUp, 'body'), authController.signUpUser);

router.post('/login', validate(schemas.logIn, 'body'), authController.signInUser);

router.post(
  '/google',
  validate(schemas.googleSignIn, 'body'),
  authController.googleSignIn,
);

router.post(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
  }),
  authController.facebookSignIn,
);

router.get('/twitter', authController.getTwitterAuthorization);
router.post('/twitter/callback', authController.twitterSignIn);

router.put('/verify-email', validate(schemas.verifyEmail), authController.verifyEmail);
router.post('/resend-verification-email', checkAuth, authController.resendVerificationEmail);

router.post(
  '/forgot-password',
  validate(schemas.checkForEmail),
  authController.forgotPassword,
);
router.put('/reset-password', validate(schemas.verifyToken), authController.resetPassword);
module.exports = router;
