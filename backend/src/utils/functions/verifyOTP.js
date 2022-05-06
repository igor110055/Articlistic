module.exports = async function verifyOTP(code, phone, sessionId, international, routeName) {
    if (!phone || !code) {
        throw new MissingParamError('Please enter both phone and code.', routeName)
    }

    if (!sessionId && !international) {

        throw new MissingParamError('Session id should be there in case local.', routeName);

    }

    if (!sessionId && international && phone.startsWith('+1')) {

        throw new MissingParamError('Session id should be there in case USA Phone number.', routeName);

    }


    if (international) {

        if (phone.startsWith('+1')) {
            try {
                logger.debug("Verifying for USA user");
                await otp.sms.tf.verifyOTP(sessionId, code)

            } catch (e) {
                throw new ServiceError('verify OTP forgot password - tf - USA with phone ' + phone.toString(), routeName, e);
            }
        } else {

            try {

                await otp.sms.aws.verifyOTP(code, phone);

            } catch (error) {
                throw new NotAuthenticatedError('Could not authenticate', routeName);
            }
        }


    } else {

        try {

            await otp.sms.tf.verifyOTP(sessionId, code)

        } catch (e) {
            throw new NotAuthenticatedError('OTP verify Error - tf', routeName, e)

        }
    }
}