const Twit = require('twit');
require('dotenv').config();

const bot = new Twit({
  consumer_key: process.env.BOT_CONSUMER_KEY,
  consumer_secret: process.env.BOT_CONSUMER_SECRET,
  access_token: process.env.BOT_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET,
});

async function tweetNewCase(data) {
  try {
    bot.post('statuses/update', { status: data });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  tweetNewCase,
};

// tweetNewCase();
