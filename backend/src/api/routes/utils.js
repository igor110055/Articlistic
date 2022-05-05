const express = require('express');
const mongo = require('../../db/mongo/index')
const redis = require('../../db/redis/index')
const encryption = require('../../utils/encryption/index');
const logger = require('../../utils/logger');
const {
    v4: uuidv4
} = require('uuid');

const useAuth = require('../../middleware/auth')
const otp = require('../../utils/otp/index');
const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const NetworkError = require('../../errors/NetworkError');
const ServiceError = require('../../errors/ServiceError');
// const {
//     redis
// } = require('googleapis/build/src/apis/redis');

module.exports = function utilitiesRouter() {

    return new express.Router().post('/refreshToken', refreshToken)
        .post('/resetPassword', resetPassword)
        .post('/phone/sendOTP', sendPhoneOTP)
        .post('/email/sendOTP', sendEmailOTP)
        .post('/phone/verifyOTP', verifyPhoneOTP)
        .post('/email/verifyOTP', verifyEmailOTP)
        .post('/logout', useAuth(false, true), logout);



    async function logout(req, res) {

        let routeName = '/utils/logout';
        let tokenInfo = req.tokenInfo;

        let username = req.username;

        logger.info(`${routeName} -- ${username}`);

        try {

            // await mongo.blacklist.addToken(accessToken, username);
            await redis.token.push(tokenInfo.token, tokenInfo.expiry);

        } catch (e) {

            throw new DatabaseError(routeName, e);

        }

        return res.status(200).send({
            'message': 'Successfully logged out!'
        })


    }

    async function refreshToken(req, res) {

        let routeName = '/utils/refreshToken';

        let rt = req.headers.authorization;


        let user;

        if (!rt) {
            throw new MissingParamError('Refresh Token Undefined.', routeName)
        }

        try {
            var decryptedRt = await encryption.decrypt(rt);

        } catch (e) {
            throw new NotAuthenticatedError('Refresh token invalid', routeName);
        }

        if (!decryptedRt) {
            throw new NotAuthenticatedError('Refresh token invalid', routeName);
        }


        logger.info(`${routeName} ` + rt);

        try {

            user = await mongo.users.findUserUsingRefreshToken(decryptedRt);

        } catch (error) {

            throw new DatabaseError(routeName, error);

        }

        if (!user) {

            throw new NotAuthenticatedError('Refresh token invalid', routeName);
        }

        let accessToken = encryption.jwt.sign(user.username);

        return res.status(200).send({
            'message': 'User re-authenticated successfully.',
            accessToken
        })


    }

    async function resetPassword(req, res) {

        let routeName = '/utils/resetPassword';

        let entity = req.body.entity;
        let type = req.body.type;
        let newPassword = req.body.password;
        let validEntity = ["phone", "email"];

        if (!entity || !type || !validEntity.includes(type) || !newPassword) {
            throw new MissingParamError('Not a valid entity.', routeName);
        }

        logger.info(`${routeName} - ${entity}`);

        let hashedEntity = encryption.staticEncrypt(entity);

        let user;
        try {

            if (type == "phone") {
                user = await mongo.users.getUser(hashedEntity, false, false, true);
            } else {
                user = await mongo.users.getUser(hashedEntity, false, true, false);
            }

        } catch (error) {

            throw new DatabaseError(routeName, error);
        }
        if (!user) {
            throw new NotAuthenticatedError('User not found.', routeName);
        }

        let private = encryption.decrypt(user.private);

        private.password = newPassword;

        let encryptedPrivateField = encryption.encrypt(private);

        try {

            await mongo.users.updatePrivateField(user.username, encryptedPrivateField)

        } catch (error) {

            throw new DatabaseError(routeName, error);

        }

        return res.status(201).send({
            'message': "Password updated."
        });


    }

    async function sendEmailOTP(req, res) {

        let email = req.query.email;
        let routeName = "utils/email/sendOTP";

        if (!email) {
            throw new MissingParamError('Email Missing', routeName);
        }

        logger.info(`${routeName} -- ${email}`);

        let user;

        let hashedEmail = encryption.staticEncrypt(email);

        try {
            user = await mongo.users.getUser(hashedEmail, false, true, false);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!user) {
            throw new NotAuthenticatedError('No user related to this account.', routeName);
        }

        let code = Math.floor(100000 + Math.random() * 900000);

        try {
            await mongo.email.createOTP(email, code.toString());
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        //Send OTP to Email. 
        try {
            await otp.email.sendEmail(email, code);

        } catch (e) {
            try {
                await mongo.email.deleteOTP(otp);
            } catch (e) {
                logger.fatal(e);
                logger.fatal("DOUBLE ERROR")
            }
            throw new ServiceError('Send Email OTP - RP', routeName, e);
        }

        return res.status(200).send({
            'message': 'OTP sent to your email.'
        })


    }

    async function sendPhoneOTP(req, res) {

        // let phone = req.query.phone;
        // let international = req.query.international;

        let {
            phone,
            international
        } = req.body;

        let routeName = 'utils/phone/sendOTP';
        // logger.error(phone);

        if (!phone) {
            throw new MissingParamError('Phone not provided.', routeName);
        }

        logger.info(`${routeName} -- ${phone}`);

        let phoneInMongo = encryption.staticEncrypt(phone);
        let user;

        try {

            user = await mongo.users.getUser(phoneInMongo, false, false, true);

        } catch (e) {
            throw e;
        }

        if (!user) {
            throw new NotAuthenticatedError("A user with this phone number does not exist.", routeName)
        }

        var sessionId;
        if (international) {

            if (phone.startsWith('+1')) {

                try {

                    sessionId = await otp.sms.tf.sendOTPToUSA(phone);

                } catch (e) {
                    throw new ServiceError('Sending Phone OTP- tf - USA with phone ' + phone.toString(), routeName, e);
                }

            } else {


                try {
                    await otp.sms.aws.sendOTP(phone);
                } catch (e) {

                    throw new ServiceError('Send OTP phone', routeName, e);
                }


            }


        } else {

            try {

                sessionId = await otp.sms.tf.sendOTP(phone);

            } catch (e) {
                throw new ServiceError('Sending Phone OTP- aws', routeName, e);
            }

        }


        return res.status(200).send({
            'message': 'OTP sent successfully.',
            sessionId
        })

    }

    async function verifyPhoneOTP(req, res) {

        let routeName = 'utils/phone/verifyOTP';

        let {
            phone,
            code,
            international,
            sessionId
        } = req.body;



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

                    let s = await otp.sms.aws.verifyOTP(code, phone);
                    logger.debug(s);

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

        return res.status(200).send({
            'message': "Verified. You're in!"
        });

    }

    async function verifyEmailOTP(req, res) {

        let email = req.query.email;
        let otp = req.query.otp;
        let routeName = 'utils/email/verifyOTP';

        if (!otp || !email) {

            throw new MissingParamError('Please enter both email and code.', routeName)

        }

        logger.info(`${routeName} -- ${email}`);


        let mongoRes;
        try {

            mongoRes = await mongo.email.checkOTP(email, otp);

        } catch (e) {

            throw new DatabaseError(routeName, e);

        }


        if (mongoRes) {
            try {
                await mongo.email.deleteAllOTPsWithEmail(email);

            } catch (e) {
                logger.fatal("Could not delete OTP from verified for some duration.");
                // throw e;
            }

        }

        if (!mongoRes) {
            throw new NotAuthenticatedError('Could not verify.', routeName);
        } else {

            return res.status(200).send({
                'message': 'You are verified!'
            })
        }


    }

}