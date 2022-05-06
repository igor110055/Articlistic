const {
    OAuth2Client
} = require('google-auth-library');
const config = require('../../../config');

const client = new OAuth2Client(config.google.clientId);
const logger = require('../logger/index')

module.exports = async function verifyGoogleIdToken(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.google.clientId
    });

    const {
        name,
        email,
        picture
    } = ticket.getPayload();

    logger.debug(email);
    logger.debug(name);
    logger.debug(picture);

    return {
        name,
        email,
        picture
    };

}