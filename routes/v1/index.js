const { Router } = require('express');

const router = Router();
const authRouter = require('./auth.route');
const userRoute = require('./user.route');
const caseRoute = require('./cases.route');
const newsLetterRoute = require('./newsletter');

router.use('/auth', authRouter);
router.use('/users', userRoute);
router.use('/cases', caseRoute);
router.use('/newsletter', newsLetterRoute);

module.exports = router;
