const { processContactMessage } = require('../background-jobs');

/**
 * Route handler for sending messages submitted through the contact form
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function sendContactMessage(req, res, next) {
  const { email, fullname, message } = req.body;
  const data = { email, fullname, message };
  processContactMessage(data);
  return res.status(200).json({
    data: {
      message: 'Thank you for your response',
    },
  });
};

module.exports = {
  sendContactMessage,
};
