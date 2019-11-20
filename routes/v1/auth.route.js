const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

/* eslint-disable import/no-dynamic-require */
const { oauthController } = require(path.join(HOME_DIR, 'controllers'));
const passport = require(path.join(HOME_DIR, 'config', 'passport.js'));

router.post('/google', oauthController.googleSignIn);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
  }),
  oauthController.facebookSignIn,
);

module.exports = router;
