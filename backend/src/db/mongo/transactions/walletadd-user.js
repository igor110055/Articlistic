var config = require('../../../../config');
const {
    MDB_COLLECTION_USERS,
    MDB_COLLECTION_WALLET_ADD
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')

const dbName = config.mongo.db;
const uc = MDB_COLLECTION_USERS;
const wc = MDB_COLLECTION_WALLET_ADD;
const {
    MDB
} = require('../client')

async function addMoneyToWallet(username, orderId) {

    let client;

    try {

        client = await MDB.getClient();

        let userCollection = client.db(dbName).collection(uc);
        let walletCollection = client.db(dbName).collection(wc);

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


        var res = await session.withTransaction(async () => {


            try {
                var walletObj = await walletCollection.findOneAndUpdate({
                    orderId: orderId
                }, {
                    $set: {
                        status: 'paid'
                    }
                }, {
                    returnDocument: 'after',
                    session: session
                })
            } catch (e) {
                await session.abortTransaction();
                logger.error("addMoneyToWallet: DB: New Writer");
                throw e;
            }
            const credits = walletObj.value.credits;
            logger.debug(credits)

            try {

                await userCollection.updateOne({
                    username: username
                }, {
                    $inc: {

                        'wallet.credits': credits
                    }
                }, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("error in create user - 1");
                throw e;
            }





        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("addMoneyToWallet mongo response time: " + timeTaken.toString());

        return res;

    } catch (e) {
        throw e;
    }
}
module.exports = {
    addMoneyToWallet
}