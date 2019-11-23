const path = require('path');
const { Router } = require('express');

const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');

const { userController } = require(path.join(HOME_DIR, 'controllers'));
const { checkAuth } = require(path.join(HOME_DIR, 'middlewares'));

router.get('/', checkAuth, userController.getUserData);
router.put('/', checkAuth, userController.updateUserProfile);

module.exports = router;
