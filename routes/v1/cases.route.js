const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { caseController } = require(path.join(HOME_DIR, 'controllers'));
const { checkAuth, checkProfileStatus, validate } = require(path.join(
  HOME_DIR,
  'middlewares',
));
const schemas = require(path.join(HOME_DIR, 'schemas'));

router.get('/', caseController.getCases);
router.get(
  '/:slug',
  validate(schemas.checkForSlug, 'params'),
  caseController.getSingleCase,
);
router.post(
  '/',
  checkAuth,
  checkProfileStatus,
  validate(schemas.createCase),
  caseController.createCase,
);
router.put('/:slug', checkAuth, checkProfileStatus, caseController.updateCase);

module.exports = router;
