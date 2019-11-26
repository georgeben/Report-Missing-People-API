const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { userController } = require(path.join(HOME_DIR, 'controllers'));
const { checkAuth, validate } = require(path.join(HOME_DIR, 'middlewares'));
const { schemas } = require(path.join(HOME_DIR, 'utils'));

router.get('/', checkAuth, userController.getUserData);
router.put(
  '/',
  checkAuth,
  validate(schemas.updateUserProfile),
  userController.updateUserProfile,
);

module.exports = router;
