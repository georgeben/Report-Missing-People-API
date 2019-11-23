const { Router } = require('express');

const router = Router();
const authRouter = require('./auth.route');
const userRoute = require('./user.route');

router.use('/auth', authRouter);
router.use('/users', userRoute);

module.exports = router;
