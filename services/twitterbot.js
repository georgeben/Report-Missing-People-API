/* eslint-disable consistent-return */
const Twit = require('twit');
const axios = require('axios');
const { handleError, logger } = require('../utils');
require('dotenv').config();

let FRONTEND_URL;

if (process.env.NODE_ENV !== 'production') {
  FRONTEND_URL = process.env.DEV_FRONTEND_URL;
} else {
  FRONTEND_URL = process.env.FRONTEND_URL;
}

const bot = new Twit({
  consumer_key: process.env.BOT_CONSUMER_KEY,
  consumer_secret: process.env.BOT_CONSUMER_SECRET,
  access_token: process.env.BOT_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET,
});

async function tweetNewCase(data) {
  try {
    let image = await axios.get(
      data.photoURL,
      { responseType: 'arraybuffer' },
    );
    let returnedB64 = Buffer.from(image.data).toString('base64');
    let result = await bot.post('media/upload', { media_data: returnedB64 });
    const mediaIdStr = result.data.media_id_string;
    const altText = 'Missing person photo';
    const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };
    await bot.post('media/metadata/create', meta_params);
    const params = {
      status: `${data.description}. For more info, visit ${FRONTEND_URL}/cases/${data.slug} #HelpLookFor${data.fullname.split(' ').join('')} #HelpLookForMe`,
      media_ids: [mediaIdStr],
    };
    await bot.post('statuses/update', params);
  } catch (error) {
    logger.log('error', `Failed to tweet case ${data._id}, ${data.fullname}`);
    return handleError(error);
  }
}

module.exports = {
  tweetNewCase,
};
