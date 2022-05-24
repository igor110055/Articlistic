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
const verifyGoogleIdToken = require('../../utils/auth/verifyGoogleIdToken');

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


        .post('/email/sendOTP', sendEmailOTP)
        .post('/email/verifyOTP', verifyEmailOTP)
        .post('/login', login)
        .post('/createUser', createUser)
        .post('/google/signup', signupUsingGoogle)

        .get('/getCategoriesAndWriters', useAuth(), getCategoriesAndWriters)
        .get('/checkUsername', checkUsername)
        .post('/updateStatus', useAuth(), updateOnboardingStatus);


    async function signupUsingGoogle(req, res) {
        const routeName = 'signup using google';

        const {
            token
        } = req.query;

        const userInfo = await verifyGoogleIdToken(token);

        const email = encryption.staticEncrypt(userInfo.email);

        try {
            var user = await mongo.users.getUser(email, false, true);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (user) {
            delete user.private;
            delete user.refreshToken;

            const accessToken = encryption.jwt.sign(user.username);
            const refreshToken = encryption.encryptForFrontend(user.refreshToken);

            /**
             * Check if user already exists
             * If he does - sign in 
             */

            return res.status(200).send({
                ...user,
                email,
                accessToken,
                refreshToken
            });



        } else {


            try {
                var id = await mongo.security.createUserAddEmail(userInfo.email);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            return res.status(200).send({
                id
            });

        }





    }

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

        try {

            await mongo.transactionWriterUser.onboardingUpdate(categories, following, username);

        } catch (e) {

            throw new DatabaseError(routeName, e);
        }

        return res.status(201).send({
            "message": "Onboarding records updated successfully. The user is fully registered now!"
        });


    }

    /**
     * Given an entity (email, username) and a password, it will return the corresponding user object
     * @param req - The request object.
     * @param res - response object
     * @returns The user object is being returned with the accessToken and refreshToken.
     */

    async function login(req, res) {

        let routeName = "POST /onboarding/login";

        /* The above code is validating the request body. */
        let {
            entity,
            password,
            type
        } = req.body;

        if (!entity || !password || !type) {
            throw new MissingParamError('Some of the param is not provided', routeName);
        }

        entity = entity.trim();


        if (!(type == 'username' || type == 'email')) {
            throw new MissingParamError('Type does not exist', routeName);
        }



        /* The above code is checking if the type is email, username . If it is email, it will
        encrypt the email using the static encrypt method. If it is username, it will do nothing. If
 */

        let email, username;

        if (type == 'email') {
            email = true;
            entity = encryption.staticEncrypt(entity);
        } else {
            username = true;
        }


        /* The above code is retrieving a user from the database. */

        let user;
        try {
            user = await mongo.users.getUser(entity, username, email);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        if (!user || user.googleUser) {
            throw new NotAuthenticatedError('Wrong password!', routeName);
        }



        let encryptedPrivateInfo = user.private;

        let decryptedPrivateInfo = encryption.decrypt(encryptedPrivateInfo);

        if (decryptedPrivateInfo.password != password) {
            throw new NotAuthenticatedError('Wrong credentials!', routeName);
        }

        user.private = decryptedPrivateInfo;

        delete user.private.password;
        delete user.email;


        let accessToken = encryption.jwt.sign(user.username);
        let refreshToken = encryption.encryptForFrontend(user.refreshToken);
        delete user.refreshToken;

        return res.status(200).send({
            ...user,
            accessToken,
            refreshToken
        });

    }

    /**
     * Check if a username is available
     * @param req - The request object.
     * @param res - The response object.
     */

    async function checkUsername(req, res) {


        let routeName = "GET /onboarding/checkUsername";

        let username = req.query.username;


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

    /**
     * Create a new user
     * @param req - The request object.
     * @param res - response object
     * @returns The user object is being returned with the access token, refresh token, and message.
     */

    async function createUser(req, res) {


        let routeName = "POST /onboarding/createUser";
        let user = {};
        let international = true;

        /* The below code is checking if the parameters are missing. If they are missing, it throws an error. */

        let {
            username,
            id,
            email,
            password,
            name,
            country,
            isWriter,
            googleUser
        } = req.body;

        if (!username || !email || !password || !name || !id || !country || isWriter === undefined) {
            throw new MissingParamError('Some parameters are missing.', routeName);
        }

        if (!googleUser) {
            googleUser = false;
        }

        if (country === "India") {
            international = false;
        }


        email = email.trim();
        /* The above code is removing any leading and trailing spaces from email . */



        /* The above code is validating that the user can be created. Check security revamp in Notion */
        try {
            await mongo.security.verifyCreateUser(id, email);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        /* The above code is encrypting the private fields of the user object. 
         * This won't be there while creating a user using google user.
         */

        if (!googleUser) {

            var privateField = {
                email,
                password
            }
            var encryptedPrivateField = encryption.encrypt(privateField);
        }

        var emailEncrypted = encryption.staticEncrypt(email);


        /*
        Creating the user object properly. 
        */

        let refreshToken = uuidv4();


        user.username = username;
        user.public = {};
        // user.public.username = username;
        user.name = name;


        if (!googleUser) {
            user.private = encryptedPrivateField;
        }

        user.email = emailEncrypted;
        user.refreshToken = refreshToken;
        user.isWriter = isWriter;
        user.international = international;
        user.googleUser = googleUser;

        /*

        Creates a transaction in the database which inserts a value of the user
        in the analytics + writers + user collection.

        */


        try {
            await mongo.transactionsUserAnalytics.createUser(user);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        /* The above code is creating a JWT token and encrypting the refresh token. 
        After this deletes not required fields and then sends out the response */

        let accessToken = encryption.jwt.sign(user.username);
        let rt = encryption.encryptForFrontend(refreshToken);



        delete user.private;
        delete user.email;
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


        //Store this OTP in MongoDB. 

        let code = Math.floor(100000 + Math.random() * 900000); //Creates a 4 digit number that doesn't contain 0 at the starting.

        try {
            await mongo.email.createOTP(email, code.toString());
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        //Send OTP to Email. 
        try {

            await otp.email.sendVerificationOTP(email, code);
        }
        catch (e) {
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
        let {
            email,
            otp
        } = req.query;

        if (!otp || !email) {
            throw new MissingParamError("Please enter otp, email & id", routeName);
        }

        let mongoRes;
        try {
            mongoRes = await mongo.email.checkOTP(email, otp);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!mongoRes) {
            throw new NotAuthenticatedError('Could not verify OTP', routeName);
        } else {

            try {
                await mongo.email.deleteAllOTPsWithEmail(email);

            } catch (e) {
                logger.fatal("Could not delete OTP from verified for some duration.");
            }
        }

        try {
            var mon = await mongo.security.createUserAddEmail(email);

        } catch (e) {
            throw new DatabaseError(routeName, e);
        }
        const id = mon;
        logger.debug(id);

        return res.status(200).send({
            'message': 'You are verified!',
            id
        });


    }







}