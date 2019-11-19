const path = require('path');
const { Router } = require('express');
const router = Router();
const HOME_DIR = path.join(__dirname, '..', '..');
const { oauthController } = require(path.join(HOME_DIR, "controllers"));

router.post("/google", oauthController.googleSignIn);


module.exports = router;