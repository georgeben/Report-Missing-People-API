const { Router } = require('express');

const router = Router();
const v1 = require('./v1');

router.use('/v1', v1);

module.exports = router;
