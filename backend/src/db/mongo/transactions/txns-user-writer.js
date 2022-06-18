const config = require('../../../../config');
const {
    MDB_COLLECTION_WRITERS,
    MDB_COLLECTION_USERS,
    MDB_COLLECTION_INTERNAL_TRANSACTIONS
} = require('../../../../constants');
const logger = require('../../../utils/logger');

const dbName = config.mongo.db;
const itc = MDB_COLLECTION_INTERNAL_TRANSACTIONS;
const uc = MDB_COLLECTION_USERS;
const wc = MDB_COLLECTION_WRITERS;
const MDB = require('../client').MDB;



async function tip(tipId, username, writer, articleId, selection, earning, attTax, otherTax, total, message) {
    var suffBalance = true;

    if (!tipId || !username || !writer || !articleId || !selection || !earning || !attTax || !total) {
        throw new Error("Some Missing Parameter");
    }

    const objToBeInsert = {
        tipId,
        username,
        writer,
        articleId,
        selection,
        earning,
        attTax,
        otherTax: otherTax ? otherTax : 0,
        total,
        message
    }

    let client = await MDB.getClient();

    let usersCollection = client.db(dbName).collection(uc);
    let internalTransactionsCollection = client.db(dbName).collection(itc);

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
            await internalTransactionsCollection.insertOne(objToBeInsert, {
                session: session
            });
        } catch (e) {
            await session.abortTransaction();
            logger.error("tip-1");
            throw e;
        }


        /**
         * Query for adding money to wallet of Writer
         */
        try {

            await usersCollection.updateOne({
                username: writer
            }, {
                $inc: {
                    "wallet.earnings": earning
                }
            }, {
                session: session
            })
        } catch (e) {
            await session.abortTransaction();
            logger.error("tip-2");
            throw e;
        }


        /**
         * Deducting from user's wallet
         * User response if doesn't match - 
         */
        var userResponse
        try {

            userResponse = await usersCollection.updateOne({
                username: username,
                "wallet.credits": {
                    $gte: total
                }
            }, {
                $inc: {
                    "wallet.credits": -total
                }
            }, {
                session: session
            })
        } catch (e) {
            await session.abortTransaction();
            logger.error(e);
            throw e;
        }

        if (userResponse.modifiedCount == 0) {
            suffBalance = false;
            await session.abortTransaction();

        }


    }, transactionOptions);

    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("tip mongo response time: " + timeTaken.toString());

    return suffBalance;

}


module.exports = {
    tip
}