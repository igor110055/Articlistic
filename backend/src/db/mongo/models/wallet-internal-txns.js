var config = require('../../../../config');
const {
    MDB_COLLECTION_INTERNAL_TRANSACTIONS
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_INTERNAL_TRANSACTIONS;


async function getTopFunders(articleId) {

    if (!articleId) throw "Article Id is required parameter";

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        const topFunders = [];

        let response = await db.aggregate([{
                $match: {
                    articleId: articleId
                }
            },
            {
                $group: {
                    _id: {
                        username: '$username',
                        articleId: '$articleId'
                    },
                    totalAmount: {
                        $sum: '$total'
                    }
                }
            }, {
                $sort: {
                    totalAmount: -1
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: '_id.username',
                    foreignField: 'username',
                    as: 'users',
                    "pipeline": [{
                        "$project": {
                            _id: 0,
                            email: 0,
                            phone: 0,
                            refreshToken: 0,
                            wallet: 0,
                            public: 0,
                            private: 0
                        }
                    }]
                }
            }, {
                $limit: 5
            }
        ])

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("create order - wallet-add - mongo response time: " + timeTaken.toString());
        logger.debug(topFunders);
        return response;

    } catch (e) {
        throw e;
    }
}


module.exports = {
    getTopFunders
}