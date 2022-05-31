const encryption = require('../utils/encryption/index');
const mongo = require('../db/mongo/index')
const logger = require('../utils/logger/index');
const NotAuthenticatedError = require('../errors/NotAuthenticatedError');
const DatabaseError = require('../errors/DatabaseError');
const redis = require('../db/redis/index')



module.exports = function (isSocketMiddleware, logout, checkIfWriter) {
    return async function asyncMiddleware(req, res, next) {

        let token = isSocketMiddleware ? req.handshake.auth.token : req.headers.authorization;

        if (isSocketMiddleware) {
            req = req.request;
        }

        if (!token) {
            next(new NotAuthenticatedError('This request requires auth token.', 'middleware-rejection'));
            return;

        }

        try {

            let tokenObj = await encryption.decrypt(token);
            if (!tokenObj || !tokenObj.token) {
                throw "Token not present"
            }
            var decryptedToken = tokenObj.token;

        } catch (e) {
            next(new NotAuthenticatedError('Could not authenticate - Decryption.', 'middleware-rejection'))
            return;
        }

        let presentInDb;

        try {
            // presentInDb = await mongo.blacklist.checkToken(decryptedToken);

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
            return;
        } else {


            try {
                if (checkIfWriter) {
                    var user = await mongo.users.getUserByUsername(check.payload.username);

                    if (!user || !user.isWriter) {
                        throw "It is required to be a writer for this operation."
                    }

                    req.user = user;

                } else {

                    let userCheckInRedis = await redis.users.check(check.payload.username.toString());

                    if (!userCheckInRedis) {

                        logger.info("User not found in cache, checking in mongodb");
                        var userInMongo = await mongo.users.getUserByUsername(check.payload.username);
                        if (!userInMongo) {
                            throw 'No user found';
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