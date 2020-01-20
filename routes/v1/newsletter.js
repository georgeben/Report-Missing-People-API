/**
 * Route for newsletter resources
 */
const path = require('path');
const { Router } = require('express');

const HOME_DIR = path.join(__dirname, '..', '..');
const { newsletterController } = require(path.join(HOME_DIR, 'controllers'));
const { validate, checkAuth } = require(path.join(HOME_DIR, 'middlewares'));
const schemas = require(path.join(HOME_DIR, 'schemas'));
const router = Router();

router.get('/', newsletterController.getAllSubscribers);
router.post(
  '/',
  validate(schemas.newsletterSubscription),
  newsletterController.addSubscription,
);

router.put(
  '/',
  checkAuth,
  validate(schemas.updateNewsletterSubscription),
  newsletterController.updateSubscription,
);

router.delete('/', checkAuth, newsletterController.unsubscribeFromNewsletter);
module.exports = router;
