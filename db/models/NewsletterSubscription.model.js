const mongoose = require('mongoose');
const NewsletterSchema = require('../schemas/NewsletterSubscription.schema');

module.exports = mongoose.model('NewsletterSubscription', NewsletterSchema);
