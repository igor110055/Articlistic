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
const getLocationForIP = require('../../utils/api/getLocationForIP');

module.exports = function utilitiesRouter() {

    return new express.Router().post('/refreshToken', refreshToken)
        .post('/resetPassword', resetPassword)
        .post('/email/sendOTP', sendEmailOTP)
        .post('/email/verifyOTP', verifyEmailOTP)
        .post('/logout', useAuth(false, true), logout)
        .get('/ip', getIPAddress);

    async function getIPAddress(req, res) {
        const routeName = 'get ip address'
        const ip = req.ip;
        try {
            var country = await getLocationForIP(ip);
        } catch (e) {
            throw new ServiceError('get location from IP', routeName, e);
        }

        return res.status(200).send({
            country
        })
    }

    async function logout(req, res) {

        let routeName = '/utils/logout';
        let tokenInfo = req.tokenInfo;

        let username = req.username;

        logger.info(`${routeName} -- ${username}`);

        try {

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
        var decryptedRt;
        try {
            decryptedRt = await encryption.decrypt(rt);

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


        let {
            email,
            newPassword,
            id
        } = req.body;



        if (!email || !newPassword || !id) {
            throw new MissingParamError('Not a valid entity.', routeName);
        }


        let hashedEntity = encryption.staticEncrypt(email);

        let user;
        try {

            user = await mongo.users.getUser(hashedEntity, false, true, false);

        } catch (error) {

            throw new DatabaseError(routeName, error);
        }



        if (!user) {
            throw new NotAuthenticatedError('User not found.', routeName);
        }


        try {
            await mongo.security.verifyEmailCode(id, email);
        } catch (e) {

            throw new DatabaseError(routeName, e);

        }


        let pvt = encryption.decrypt(user.private);

        pvt.password = newPassword;
        logger.debug("here");
        let encryptedPrivateField = encryption.encrypt(pvt);

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

        let {
            email
        } = req.query;

        let routeName = "email send otp - forgot password";

        if (!email) {
            throw new MissingParamError('Email Missing', routeName);
        }


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

        const code = Math.floor(100000 + Math.random() * 900000);

        try {
            await mongo.email.createOTP(email, code.toString());
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        //Send OTP to Email. 
        try {
            await otp.email.sendVerificationOTP(email, code);

        } catch (e) {
            try {
                await mongo.email.deleteOTP(code);
            } catch (err) {
                logger.fatal(err);
                logger.fatal("DOUBLE ERROR")
            }
            throw new ServiceError('Send Email OTP - RP', routeName, e);
        }

        return res.status(200).send({
            'message': 'OTP sent to your email.'
        })


    }


    async function verifyEmailOTP(req, res) {

        let {
            email,
            otp
        } = req.query;

        let routeName = 'utils/email/verifyOTP';

        if (!otp || !email) {

            throw new MissingParamError('Please enter both email and code.', routeName)

        }



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

            var id;
            try {
                id = await mongo.security.forgotPasswordUsingEmail(email);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            if (!id) throw new NotAuthenticatedError('Something went wrong while generatingId', routeName);

            return res.status(200).send({
                'message': 'You are verified!',
                id
            })
        }


    }

}