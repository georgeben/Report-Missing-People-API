const { Router } = require('express');
const path = require('path');

const HOME_DIR = path.join(__dirname, '..', '..');
const { statsController } = require(path.join(HOME_DIR, 'controllers'));
const router = Router();

router.get('/', statsController.getStats);

module.exports = router;
