const express = require('express');
const { authHelper } = require('../utils/');

const router = express.Router();

router.use(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return next();
  }
  try {
    const requestToken = authorizationHeader.split('Bearer').pop().trim();
    const decoded = await authHelper.decodeJWTToken(requestToken);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    switch (error.name) {
      case 'JsonWebTokenError':
        return res.status(401).json({
          error: 'Invalid JWT supplied',
        });
      case 'TokenExpiredError':
        return res.status(401).json({
          error: 'Expired JWT token supplied.',
        });
      default:
        next(error);
    }
  }
});

module.exports = router;
