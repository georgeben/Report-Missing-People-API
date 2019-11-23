const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

/* eslint-disable import/no-dynamic-require */
const { authController } = require(path.join(HOME_DIR, 'controllers'));
const passport = require(path.join(HOME_DIR, 'config', 'passport.js'));

router.post('/signup', authController.signUpUser);
router.post('/login', authController.signInUser);

router.post('/google', authController.googleSignIn);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
  }),
  authController.facebookSignIn,
);

router.get('/twitter', authController.getTwitterAuthorization);
router.get('/twitter/callback', authController.twitterSignIn);

module.exports = router;
