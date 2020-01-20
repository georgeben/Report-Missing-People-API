const { Router } = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const router = Router();

/**
 * Middleware for checking the recaptcha token.
 */

router.use(async (req, res, next) => {
  const { recaptchaToken } = req.body;
  if (!recaptchaToken) {
    if (req.file) await fs.unlinkAsync(req.file.path);
    return res.status(400).json({
      error: 'A recaptcha token is required',
    });
  }

  const verifyCaptchaOptions = {
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    json: true,
    form: {
      secret: process.env.CAPTCHA_SECRET,
      response: recaptchaToken,
    },
  };
  // TODO: Refactor to use a promise
  request.post(verifyCaptchaOptions, async (error, response, body) => {
    if (error) {
      if (req.file) await fs.unlinkAsync(req.file.path);
      return next(error);
    }

    if (!body.success) {
      if (req.file) await fs.unlinkAsync(req.file.path);
      return res.status(400).json({
        error: 'Invalid reCaptcha code',
      });
    }
    return next();
  });
});

module.exports = router;
