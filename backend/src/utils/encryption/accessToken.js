var config = require('../../../config');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const encryption = require('./encryption')

function sign(username) {
    logger.info("Signing for user: " + username);
    let accessToken = jwt.sign({
        username: username
    }, config.jwt.tokenSecret, {
        expiresIn: '1 year'
    });
    let encryptedAccessToken = encryption.encryptForFrontend({
        token: accessToken
    });
    return encryptedAccessToken;
}

function verify(token) {
    let username = jwt.verify(token, config.jwt.tokenSecret, {
        complete: true
    });

    logger.info("Verified token for: " + username)

    return username;

}

module.exports = {
    sign,
    verify
}