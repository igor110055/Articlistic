const config = require('../../../../config');
const {
    MDB_COLLECTION_USERS,
    MDB_COLLECTION_EARNINGS_TO_WALLET
} = require('../../../../constants');
const logger = require('../../../utils/logger');

const dbName = config.mongo.db;
const txn = MDB_COLLECTION_EARNINGS_TO_WALLET;
const uc = MDB_COLLECTION_USERS;
const MDB = require('../client').MDB;


async function convertEarningsToWalletCredits(amount, username) {
    var suffBalance = true;

    const objToBeInsert = {
        username,
        amount,
        timestamp: Date.now()
    }

    let client = await MDB.getClient();

    let usersCollection = client.db(dbName).collection(uc);
    let walletToEarningsCollection = client.db(dbName).collection(txn);

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
        var p
        try {
            p = await walletToEarningsCollection.insertOne(objToBeInsert, {
                session: session
            });
        } catch (e) {
            await session.abortTransaction();
            logger.error(e);
            throw e;
        }

        logger.debug(p);


        /**
         * Query for taking out money from 
         * earnings & putting them in wallet.
         */
        var userResponse
        try {

            userResponse = await usersCollection.updateOne({
                username: username,
                "wallet.earnings": {
                    $gte: amount
                },
            }, {
                $inc: {
                    "wallet.earnings": -amount,
                    "wallet.credits": amount
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

    logger.info("convert earnings to wallet - mongo response time: " + timeTaken.toString());

    return suffBalance;

}


module.exports = {
    convertEarningsToWalletCredits
}