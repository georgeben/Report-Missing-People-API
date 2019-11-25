const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { caseController } = require(path.join(HOME_DIR, 'controllers'));
const { checkAuth, checkProfileStatus } = require(path.join(HOME_DIR, 'middlewares'));

router.get('/', caseController.getCases);
router.get('/:slug', caseController.getSingleCase);
router.post('/', checkAuth, checkProfileStatus, caseController.createCase);

module.exports = router;
