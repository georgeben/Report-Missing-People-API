const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { userController } = require(path.join(HOME_DIR, 'controllers'));
const { checkAuth, validate, upload } = require(path.join(HOME_DIR, 'middlewares'));
const schemas = require(path.join(HOME_DIR, 'schemas'));

router.get('/', checkAuth, userController.getUserData);
router.get('/cases', checkAuth, userController.getUserCases);
router.put(
  '/',
  checkAuth,
  upload('profile-photo'),
  validate(schemas.updateUserProfile),
  userController.updateUserProfile,
);
router.put('/email', checkAuth, validate(schemas.updateEmail), userController.updateEmail);
router.put('/password', checkAuth, validate(schemas.updatePassword), userController.updatePassword);

module.exports = router;
