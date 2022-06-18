var config = require('../../../../config');
const {
    MDB_COLLECTION_CATEGORY
} = require('../../../../constants');

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_CATEGORY;

async function getCategories(skip, limit) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let allCategories = [];


        let cursor = db.find({}, {
            projection: {
                _id: 0,
                articles: 0,
                details: 0
            }
        }).limit(limit).skip(skip);

        await cursor.forEach((x) => {
            allCategories.push(x)
        });

        let count = await db.countDocuments();

        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("getCategories mongo response time: " + timeTaken.toString());


        return {
            categories: allCategories,
            count
        };


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}



async function createUniquenessIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        await db.createIndex({
            'name': 1
        }, {
            unique: true
        });


        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("categories: createUniquenessIndex mongo response time: " + timeTaken.toString());




    } catch (e) {
        logger.debug(e);
        throw e;
    }
}



module.exports = {
    getCategories,
    createUniquenessIndex
}