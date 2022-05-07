var config = require('../../../../config');
const {
    MDB_COLLECTION_WALLET_PAYOUT
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_WALLET_PAYOUT;

async function payoutInitiated(orderId) {


    if (!orderId) {
        throw "Some required parameters missing for updating order"
    }

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            orderId: orderId
        }, {
            $set: {
                status: 'paid'
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("update order - wallet-add - mongo response time: " + timeTaken.toString());

        return response;

    } catch (e) {
        throw e;
    }
}