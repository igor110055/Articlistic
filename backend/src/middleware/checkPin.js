const mongo = require('../db/mongo/index');
const DatabaseError = require('../errors/DatabaseError');
const MissingParamError = require('../errors/MissingParamError');
const NotAuthenticatedError = require('../errors/NotAuthenticatedError');
const logger = require('../utils/logger');
const Pin = require('../utils/encryption/pin')

module.exports = function () {

    /**
     * Previous middleware should set req.user
     */
    return async function asyncMiddleware(req, res, next) {
        const {
            pin
        } = req.query;
        const user = req.user;
        const username = req.user.username;

        if (!pin || !user) throw new MissingParamError('Some missing error', 'middleware-checkPin');


        const walletInfo = user.wallet;



        if (!walletInfo || !walletInfo.pin) {

            /**
             * Check if wallet is activated or not. 
             */
            throw new NotAuthenticatedError("Wallet not activated", 'middleware-checkPin');


        } else if (walletInfo.cooldown > Date.now()) {
            /**
             * Check if cool down is valid or not. 
             */

            throw new NotAuthenticatedError('coolDown', 'checkPin-mw');
        } else if (walletInfo.ban === true) {

            /**
             * Check if wallet is banned
             */

            throw new NotAuthenticatedError('Wallet banned', 'checkPin-mw');
        }



        try {

            await Pin.compare(pin, user.wallet.pin);


            if (req.user.pinRetries != 0) {

                /**
                 * If user had multiple retries - let him make the retries as default if he 
                 * enters the right pin. 
                 */

                try {
                    await mongo.users.makeRetriesDefault(username);
                } catch (e) {
                    throw new DatabaseError('pin-mw', e);
                }
            }

            next();

        } catch (e) {
            logger.info(e);
            try {

                /**
                 * We increment the pin retries in every wrong pin entry. 
                 */

                await mongo.users.incrementPinRetry(username);

            } catch (e) {
                throw new DatabaseError('pin-mw', e);
            }

            if (walletInfo.pinRetries == 20) {

                /**
                 * Ban wallet if there are more than 20 retries.
                 */

                logger.info("Account banned")
                try {

                    await mongo.users.banAccount(username);

                } catch (e) {
                    throw new DatabaseError('pin-mw', e);
                }


            } else if (walletInfo.pinRetries != 0 && walletInfo.pinRetries % 5 == 0) {

                /**
                 * In case the retires have been less than 20 
                 * Set a cool down period of 10 minutes.  
                 */

                logger.info("Cool down set")

                try {
                    const cooldown = Date.now() + 60 * 10 * 1000;
                    await mongo.users.setCooldown(username, cooldown);

                } catch (e) {
                    throw new DatabaseError('pin-mw', e);
                }

            }

            /**
             * At the end of this process. Return a not authenticated error. 
             */

            throw new NotAuthenticatedError("Wrong PIN", 'middleware-checkPin');
        }

    }
}