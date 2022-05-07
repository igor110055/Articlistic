const mongo = require('../../db/mongo/index');
const DatabaseError = require('../../errors/DatabaseError');
const MissingParamError = require('../../errors/MissingParamError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const logger = require('../logger');
module.exports = async function verifyEmailOTP(otp, email, routeName, type) {
    if (!otp || !email) {

        throw new MissingParamError('Please enter both email and code.', routeName)

    }


    try {

        var mongoRes = await mongo.email.checkWalletOTP(email, otp, type);

    } catch (e) {

        throw new DatabaseError(routeName, e);

    }


    if (mongoRes) {
        try {
            await mongo.email.deleteAllWalletOTPsWithEmail(email, type)
        } catch (e) {
            logger.fatal("Could not delete OTP from verified for some duration.");
        }

    } else {
        throw new NotAuthenticatedError('Could not verify.', routeName);
    }

}