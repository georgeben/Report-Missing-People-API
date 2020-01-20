const { Router } = require('express');

const router = Router();

/**
 * Middleware for checking that the user sending the has completed profile.
 */
router.use((req, res, next) => {
  if (!req.user.completedProfile) {
    return res.status(403).json({
      error: 'User must complete profile in order to report cases',
    });
  }
  next();
});

module.exports = router;
