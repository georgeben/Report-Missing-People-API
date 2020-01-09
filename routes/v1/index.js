const { Router } = require('express');

const router = Router();
const authRouter = require('./auth.route');
const userRoute = require('./user.route');
const caseRoute = require('./cases.route');
const newsLetterRoute = require('./newsletter');
const contactRoute = require('./contact.route');
const statsRoute = require('./stats.route');

router.use('/auth', authRouter);
router.use('/users', userRoute);
router.use('/cases', caseRoute);
router.use('/newsletter', newsLetterRoute);
router.use('/contact', contactRoute);
router.use('/stats', statsRoute);

module.exports = router;
