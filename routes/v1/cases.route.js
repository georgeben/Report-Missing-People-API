/**
 * Route for accessing case resources
 */
const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { caseController } = require(path.join(HOME_DIR, 'controllers'));
const {
  checkAuth,
  checkProfileStatus,
  validate,
  upload,
  validateRecaptcha,
} = require(path.join(HOME_DIR, 'middlewares'));
const schemas = require(path.join(HOME_DIR, 'schemas'));

router.get('/', caseController.getCases);
router.get('/:slug/related', validate(schemas.checkForSlug, 'params'), caseController.getRelatedCases);

router.get(
  '/:slug',
  validate(schemas.checkForSlug, 'params'),
  caseController.getSingleCase,
);
router.post(
  '/',
  checkAuth,
  checkProfileStatus,
  upload('casePhoto'),
  validateRecaptcha,
  validate(schemas.createCase),
  caseController.createCase,
);

router.put('/:slug/status', checkAuth, checkProfileStatus, caseController.updateCaseStatus);

router.put(
  '/:slug',
  checkAuth,
  checkProfileStatus,
  validate(schemas.checkForSlug, 'params'),
  upload('casePhoto'),
  validateRecaptcha,
  validate(schemas.updateCase),
  caseController.updateCase,
);

module.exports = router;
