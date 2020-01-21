/**
 * Parses the authorization header in requests and creates a req.user property
 * with details of the authenticated user
 */

const express = require('express');
const { authHelper } = require('../utils/');
const { userService } = require('../services');

const router = express.Router();

router.use(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return next();
  }
  try {
    const requestToken = authorizationHeader.split('Bearer').pop().trim();
    const decoded = await authHelper.decodeJWTToken(requestToken);
    const user = await userService.findUserByID(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }
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
