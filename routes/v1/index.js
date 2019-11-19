const { Router } = require('express');
const router = Router();
const authRouter = require('./auth.route');

router.use('/auth', authRouter);

module.exports = router;