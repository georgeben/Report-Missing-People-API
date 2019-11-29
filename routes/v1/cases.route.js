const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { caseController } = require(path.join(HOME_DIR, 'controllers'));
const { checkAuth, checkProfileStatus, validate, upload } = require(path.join(
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
  upload('case-photo'),
  validate(schemas.createCase),
  caseController.createCase,
);
router.put(
  '/:slug',
  checkAuth,
  checkProfileStatus,
  validate(schemas.checkForSlug, 'params'),
  upload('case-photo'),
  validate(schemas.updateCase),
  caseController.updateCase,
);

module.exports = router;
