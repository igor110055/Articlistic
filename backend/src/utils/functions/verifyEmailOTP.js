const mongo = require('../../db/mongo/index');
const DatabaseError = require('../../errors/DatabaseError');
const MissingParamError = require('../../errors/MissingParamError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const logger = require('../logger');
module.exports = async function verifyEmailOTP(otp, email, routeName) {
    if (!otp || !email) {

        throw new MissingParamError('Please enter both email and code.', routeName)

    }

    let mongoRes;
    try {

        mongoRes = await mongo.email.checkWalletOTP(email, otp);

    } catch (e) {

        throw new DatabaseError(routeName, e);

    }


    if (mongoRes) {
        try {
            var delRes = await mongo.email.deleteAllWalletOTPsWithEmail(email);
            logger.debug(delRes);
        } catch (e) {
            logger.fatal("Could not delete OTP from verified for some duration.");
        }

    } else {
        throw new NotAuthenticatedError('Could not verify.', routeName);
    }

}