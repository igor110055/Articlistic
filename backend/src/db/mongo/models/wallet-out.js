var config = require('../../../../config');
const {
    MDB_COLLECTION_WALLET_PAYOUT,
    PAYOUT_STATUS_SUCCESS
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_WALLET_PAYOUT;

async function payoutSuccess(payoutId) {


    if (!payoutId) {
        throw "Some required parameters missing for updating order"
    }

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            payoutId
        }, {
            $set: {
                status: PAYOUT_STATUS_SUCCESS
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("payout success - mongo response time: " + timeTaken.toString());

        return response;

    } catch (e) {
        throw e;
    }
}

module.exports = {
    payoutSuccess
}