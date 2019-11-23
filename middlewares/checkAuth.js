const { Router } = require('express');

const router = Router();
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'User must be logged in',
    });
  }
  next();
});

module.exports = router;
