const config = require('../../../../config');
const {
    MDB_COLLECTION_USERS,
    MDB_COLLECTION_WALLET_PAYOUT,
    EARNING_MINIMUM_BALANCE
} = require('../../../../constants');
const logger = require('../../../utils/logger');

const dbName = config.mongo.db;
const po = MDB_COLLECTION_WALLET_PAYOUT;
const uc = MDB_COLLECTION_USERS;
const MDB = require('../client').MDB;


async function payout(amount, username, payoutId) {
    var suffBalance = true;

    const objToBeInsert = {
        payoutId,
        username,
        amount,
        timestamp: Date.now()
    }

    client = await MDB.getClient();

    let usersCollection = client.db(dbName).collection(uc);
    let payoutCollection = client.db(dbName).collection(po);

    let startTime = Date.now();

    const session = client.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {
            level: 'local'
        },
        writeConcern: {
            w: 'majority'
        }
    }


    await session.withTransaction(async () => {


        /**
         * For entering a record of the transaction 
         * that is gonna happen. 
         */

        try {
            await walletToEarningsCollection.insertOne(objToBeInsert, {
                session: session
            });
        } catch (e) {
            await session.abortTransaction();
            logger.error(e);
            throw e;
        }



        /**
         * Query for taking out money from 
         * earnings & putting them in wallet.
         */
        try {

            var userResponse = await usersCollection.updateOne({
                username: username,
                "wallet.earnings": {
                    $gte: amount + EARNING_MINIMUM_BALANCE
                },
            }, {
                $inc: {
                    "wallet.earnings": -amount
                }
            });



        } catch (e) {
            await session.abortTransaction();
            logger.error(e);
            throw e;
        }



        if (userResponse.modifiedCount === 0) {
            suffBalance = false;
            await session.abortTransaction();
        }


    }, transactionOptions);

    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("payout - mongo response time: " + timeTaken.toString());

    return suffBalance;

}


module.exports = {
    payout
}