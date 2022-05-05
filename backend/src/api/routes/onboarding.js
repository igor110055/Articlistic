'use strict';

var express = require('express');
const {
    v4: uuidv4
} = require('uuid');

// require('../../errors/customError');

var mongo = require('../../db/mongo/index');
const logger = require('../../utils/logger/index')

const useAuth = require('../../middleware/auth')

const otp = require('../../utils/otp/index')

var encryption = require('../../utils/encryption/index');
const NetworkError = require('../../errors/NetworkError');
const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const ServiceError = require('../../errors/ServiceError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const BadRequestError = require('../../errors/BadRequestError');

/*


let eStatusCode = 400; 
        try{

        }catch(e){
            logger.error("createUser - Error" + error.toString() + " and status code:" + eStatusCode.toString());
            return res.status(eStatusCode).send({
                "message": "Some error occurred",
                error
            });
        }
*/

module.exports = function onboardingRouter() {

    return new express.Router()
        .get('/getCategoriesAndWriters', useAuth(), getCategoriesAndWriters)
        .get('/checkUsername', checkUsername)
        .post('/updateStatus', useAuth(), updateOnboardingStatus)
        .post('/phone/sendOTP', sendPhoneOTP)
        .post('/phone/verifyOTP', verifyPhoneOTP)
        .post('/email/sendOTP', sendEmailOTP)
        .post('/email/verifyOTP', verifyEmailOTP)
        .post('/login', login)
        .post('/createUser', createUser);


    async function getCategoriesAndWriters(req, res) {

        let routeName = "GET /onboarding/getCategoriesAndWriters";

        let {
            cLimit,
            cSkip,
            wLimit,
            wSkip
        } = req.query;

        if (!cLimit) cLimit = 10;
        if (!wLimit) wLimit = 10;
        if (!cSkip) cSkip = 0;
        if (!wSkip) wSkip = 0;

        cLimit = parseInt(cLimit);
        cSkip = parseInt(cSkip);
        wLimit = parseInt(wLimit);
        wSkip = parseInt(wSkip);

        try {
            logger.info(routeName);

            let categories = await mongo.categories.getCategories(cSkip, cLimit);

            let writers = await mongo.writers.getWriters(wSkip, wLimit);

            res.status(200).send({
                cCount: categories.count,
                wCount: writers.count,
                categories: categories.categories,
                writers: writers.writers
            });

        } catch (error) {
            throw new DatabaseError(routeName, error);
        }

    }

    async function updateOnboardingStatus(req, res) {

        let routeName = "POST /onboarding/updateStatus"

        let categories = [],
            following = [];

        categories = req.body.categories;
        following = req.body.following;

        let username = req.username;

        logger.info(routeName + ` for ${username}`);


        if (categories.length < 3 || following.length < 5) {
            throw new MissingParamError('Categories, Following are missing parameters.', routeName);
        }

        //ATT005 - Caching Database - Redis
        // try {

        //     var allCategories = await mongo.categories.getCategories();
        //     var allFollowing = await mongo.writers.getWriters();

        // } catch (e) {

        //     throw new DatabaseError(routeName, e);
        // }

        //ATT005 - O(N*N) - WORK ON THIS
        // const isCategoriesSubset = categories.every(val => allCategories.includes(val));
        // const isFollowingSubset = following.every(val => allFollowing.includes(val));

        // if (!isCategoriesSubset || true) {
        //     logger.debug(isCategoriesSubset);
        //     logger.debug(isFollowingSubset);
        //     throw new MissingParamError('Some writers or categories are not present in db', routeName)
        // }

        try {

            await mongo.transactionWriterUser.onboardingUpdate(categories, following, username);

        } catch (e) {

            throw new DatabaseError(routeName, e);
        }

        return res.status(201).send({
            "message": "Onboarding records updated successfully. The user is fully registered now!"
        });


    }

    async function sendPhoneOTP(req, res) {
        let routeName = "POST /onboarding/sendOTP"

        // let phone = req.query.phone;
        // let international = req.query.international;

        let {
            phone,
            international
        } = req.body;

        logger.info(routeName + `for phone: ${phone}`);

        if (!phone) {
            throw new MissingParamError('Phone number is missing', routeName);
        }

        let phoneInMongo = encryption.staticEncrypt(phone);

        let user;

        try {

            user = await mongo.users.getUser(phoneInMongo, false, false, true);

        } catch (e) {

            throw new DatabaseError(routeName, e);
        }


        if (user) {
            throw new NetworkError('User already present', 409, routeName, 'User with this phone number already present!');
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
                    throw new ServiceError('Sending Phone OTP- aws', routeName, e);
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


        // let phone = req.query.phone;
        // let code = req.query.otp;
        // let international = req.query.international;
        // let sessionId = req.query.sessionId;

        let {
            phone,
            code,
            international,
            sessionId
        } = req.body;

        // let code = otp;


        let routeName = "POST /onboarding/sendOTP";



        if (!phone || !code || phone.length < 10) {

            throw new MissingParamError('Phone or OTP is missing.', routeName);

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

                    await otp.sms.tf.verifyOTP(sessionId, code);

                } catch (e) {

                    throw new ServiceError('Verify Phone OTP- tf - USA with phone ' + phone.toString(), routeName, e);

                }

            } else {

                try {

                    await otp.sms.aws.verifyOTP(code, phone);

                } catch (error) {

                    throw new ServiceError('OTP verify Error - aws', routeName, error)
                }
            }


        } else {

            try {

                await otp.sms.tf.verifyOTP(sessionId, code)

            } catch (e) {
                throw new ServiceError('OTP verify Error - tf', routeName, e)

            }
        }

        return res.status(200).send({
            'message': "Verified. You're in!"
        })


    }

    async function login(req, res) {

        let routeName = "POST /onboarding/login";

        let {
            entity,
            password,
            type
        } = req.body;

        entity = entity.trim();

        if (!(type && (type == 'username' || type == 'email' || type == 'phone'))) {
            throw new MissingParamError('Type does not exist', routeName);
        }

        if (!entity || !password) {
            throw new MissingParamError('Some of the param is not provided', routeName);
        }

        let email, username, phone;



        logger.info(`${routeName} with email: ${email}`);

        if (type == 'email') {
            email = true;
            entity = encryption.staticEncrypt(entity);
        } else if (type == 'username') {
            username = true;
        } else {
            phone = true;
            entity = encryption.staticEncrypt(entity.toString());
        }



        let user;
        try {
            user = await mongo.users.getUser(entity, username, email, phone);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        if (!user) {
            throw new NetworkError("No user corresponding to entity found", 400, routeName, "User undefined");
        }



        let encryptedPrivateInfo = user.private;

        let decryptedPrivateInfo = encryption.decrypt(encryptedPrivateInfo);

        if (decryptedPrivateInfo.password != password) {
            throw new NotAuthenticatedError('Wrong password!', routeName);
        }

        user.private = decryptedPrivateInfo;

        delete user.private.password;
        delete user.email;
        delete user.phone;


        let accessToken = encryption.jwt.sign(user.username);
        let refreshToken = encryption.encryptForFrontend(user.refreshToken);
        delete user.refreshToken;

        return res.status(200).send({
            ...user,
            accessToken,
            refreshToken
        });

    }

    async function checkUsername(req, res) {


        let routeName = "POST /onboarding/checkUsername";

        let username = req.query.username;

        logger.info(`${routeName} - for username: ${username}`);

        if (!username) {
            throw new NetworkError("No username found", 400, routeName, "Not available");
        }

        let user;
        try {

            user = await mongo.users.getUserByUsername(username);

        } catch (e) {

            throw new NetworkError("Database Error", 500, routeName, e);
        }

        if (!user) {

            res.status(200).send({
                message: "Username available."
            });

        } else {

            throw new NetworkError("Username unavailable.", 409, routeName, "Not available");

        }

    }

    async function createUser(req, res) {


        let routeName = "POST /onboarding/createUser";
        let user = {};

        let {
            username,
            email,
            password,
            phone,
            name,
            international
        } = req.body;

        logger.info(routeName + ' for - ' + username);

        if (!username || !email || !password || !phone || !name || international == undefined) {
            throw new MissingParamError('Some parameters are missing.', routeName);
        }


        phone = phone.trim();
        email = email.trim();

        if ((!international && phone.length > 10) || phone.startsWith('+91')) {
            throw new BadRequestError('Indian numbers to be sent without code', routeName);
        }

        let privateField = {
            phone,
            email,
            password
        }

        let encryptedPrivateField = encryption.encrypt(privateField);

        let emailEncrypted = encryption.staticEncrypt(email);
        let phoneEncrypted = encryption.staticEncrypt(phone);

        let refreshToken = uuidv4();


        user.username = username;
        user.public = {};
        // user.public.username = username;
        user.name = name;

        user.private = encryptedPrivateField;
        user.email = emailEncrypted;
        user.phone = phoneEncrypted;
        user.refreshToken = refreshToken;
        user.isWriter = true;
        user.international = international ? true : false;

        //Store in db. 
        try {
            await mongo.transactionsUserAnalytics.createUser(user);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        let accessToken = encryption.jwt.sign(user.username);
        let rt = encryption.encryptForFrontend(refreshToken);


        delete user.private;
        delete user.email;
        delete user.phone;
        delete user.public;
        delete user.refreshToken;

        return res.status(201).send({
            ...user,
            accessToken,
            refreshToken: rt,
            "message": "User successfully created."
        });



    }

    async function sendEmailOTP(req, res) {


        let email = req.query.email;
        let routeName = 'POST /onboarding/email/sendOTP';

        if (!email) {
            throw new MissingParamError('Email is missing.', routeName);
        }

        logger.info(`${routeName} for Email: ${email}`);

        let user;

        let encryptedEmail = encryption.staticEncrypt(email);

        try {
            user = await mongo.users.getUser(encryptedEmail, false, true, false);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (user) {
            throw new NetworkError('Some user already exists', 409, routeName, 'Already present.')
        }


        //Store this OTP in monogdb. 

        let code = Math.floor(100000 + Math.random() * 900000); //Creates a 4 digit number that doesn't contain 0 at the starting.

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
                await mongo.email.deleteOTP(code);
            } catch (e) {
                logger.fatal(e);
                logger.fatal("DOUBLE ERROR");
                throw e;
            }
            throw new ServiceError('Email OTP Sending', routeName, e);

        }
        return res.status(200).send({
            'message': 'OTP Sent'
        });


    }

    async function verifyEmailOTP(req, res) {

        let routeName = 'POST /onboarding/email/verifyOTP';

        let email = req.query.email;
        let otp = req.query.otp;

        if (!otp || !email) {
            throw new MissingParamError("Please enter otp and email", routeName);
        }

        logger.info(`${routeName} for Email: ${email}`);


        let mongoRes;
        try {
            mongoRes = await mongo.email.checkOTP(email, otp);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!mongoRes) {
            // eStatusCode = 403;
            throw new NotAuthenticatedError('Could not verify OTP', routeName);
        } else {

            try {
                await mongo.email.deleteAllOTPsWithEmail(email);

            } catch (e) {
                logger.fatal("Could not delete OTP from verified for some duration.");
                // throw e;
            }
        }

        return res.status(200).send({
            'message': 'You are verified!'
        });


    }

}