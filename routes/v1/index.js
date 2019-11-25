const { Router } = require('express');

const router = Router();
const authRouter = require('./auth.route');
const userRoute = require('./user.route');
const caseRoute = require('./cases.route');

router.use('/auth', authRouter);
router.use('/users', userRoute);
router.use('/cases', caseRoute);

module.exports = router;
