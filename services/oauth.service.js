const { OAuth2Client } = require("google-auth-library");

/**
 * Retrieves the user's google profile information
 * @param {String} id_token - The ID token
 * @returns {Object} payload - The user's google data
 */
async function verifyGoogleIDToken(id_token) {
  const CLIENT_ID = process.env.CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  return payload;
}

module.exports = {
  verifyGoogleIDToken
};
