const encryption = require('../utils/encryption/index');
const mongo = require('../db/mongo/index')
const logger = require('../utils/logger/index');
const NotAuthenticatedError = require('../errors/NotAuthenticatedError');
const DatabaseError = require('../errors/DatabaseError');
const redis = require('../db/redis/index')



module.exports = function (isSocketMiddleware, logout, checkIfWriter, attachUserWithRequest) {
    return async function asyncMiddleware(req, _res, next) {

        let token = isSocketMiddleware ? req.handshake.auth.token : req.headers.authorization;

        if (isSocketMiddleware) {
            req = req.request;
        }

        if (!token) {
            next(new NotAuthenticatedError('This request requires auth token.', 'middleware-rejection'));
            return;

        }
        var decryptedToken
        try {

            let tokenObj = await encryption.decrypt(token);
            if (!tokenObj || !tokenObj.token) {
                throw new Error("Token not present");
            }
            decryptedToken = tokenObj.token;

        } catch (e) {
            next(new NotAuthenticatedError('Could not authenticate - Decryption.', 'middleware-rejection'))
            return;
        }

        let presentInDb;

        try {


            presentInDb = await redis.token.check(decryptedToken);

        } catch (e) {
            next(new DatabaseError('middleware-rejection-dbProblem', e));
            return;

        }
        if (presentInDb) {
            next(new NotAuthenticatedError('Could not authenticate - Blacklist.', 'middleware-rejection'));
            return;
        }

        let check;
        try {
            check = encryption.jwt.verify(decryptedToken);
        } catch (error) {
            logger.error(error);
        }



        if (!check || !check.payload || !check.payload.username) {
            next(new NotAuthenticatedError('Could not authenticate - expired.', 'middleware-rejection'));

        } else {


            try {
                if (attachUserWithRequest || checkIfWriter) {
                    var user = await mongo.users.getUserByUsername(check.payload.username);


                    /**
                     * Checks if user exists & is a writer
                     * and throws an error if checkIfWriter is true.
                     */

                    if (checkIfWriter && (!user || !user.isWriter)) {
                        throw new Error("It is required to be a writer for this operation.");
                    }

                    req.user = user;

                } else {

                    let userCheckInRedis = await redis.users.check(check.payload.username.toString());

                    if (!userCheckInRedis) {

                        logger.info("User not found in cache, checking in mongodb");
                        var userInMongo = await mongo.users.getUserByUsername(check.payload.username);
                        if (!userInMongo) {
                            throw new Error('No user found');
                        } else {
                            await redis.users.push(check.payload.username.toString());
                        }
                    }
                }

            } catch (e) {
                logger.fatal('Intruder alert with jwt: ' + token);
                logger.error(e);
                next(new NotAuthenticatedError('Could not authenticate.', 'middleware-rejection-u'));
                return;
            }


            req.username = check.payload.username;

            if (logout) {
                req.tokenInfo = {
                    token: decryptedToken,
                    expiry: check.payload.exp
                };
            }

            next();

        }
    }

}