var config = require('../../../../config');
const MongoClient = require('mongodb').MongoClient;

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = 'categories';
const mongodbUri = config.mongo.uri; // TODO: Add mongo db url here -> In config and .env file

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
        throw e;
    }
}





async function insertIntoCategory(articleId, categories = []) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        const bulk = db.initializeUnorderedBulkOp();

        categories.forEach((x) => bulk.find({
            name: x
        }).upsert().updateOne({

            $addToSet: {
                "articles": articleId
            },

        }));

        await bulk.execute();


        let endTime = Date.now();


        let timeTaken = endTime - startTime;

        logger.info("insertIntoCategory mongo response time: " + timeTaken.toString());

        
        return 'Success';


    } catch (e) {
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
        throw e;
    }
}



module.exports = {
    getCategories,
    insertIntoCategory,
    createUniquenessIndex
}