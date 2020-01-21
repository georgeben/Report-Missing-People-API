/**
 * Route for sending 'contact me' messages
 */

const { Router } = require('express');
const path = require('path');

const HOME_DIR = path.join(__dirname, '..', '..');
const { contactController } = require(path.join(HOME_DIR, 'controllers'));
const { validate } = require(path.join(HOME_DIR, 'middlewares'));
const schemas = require(path.join(HOME_DIR, 'schemas'));
const router = Router();

router.post('/', validate(schemas.contactMessage), contactController.sendContactMessage);

module.exports = router;
