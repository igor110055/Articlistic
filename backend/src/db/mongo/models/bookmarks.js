var config = require('../../../../config');
const MongoClient = require('mongodb').MongoClient;

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = 'bookmarks';
const mongodbUri = config.mongo.uri; // TODO: Add mongo db url here -> In config and .env file




async function createIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.createIndex({
            username: 1,
            articleId: 1
        }, {
            unique: true
        })

        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("createIndex - bookmarks mongo response time: " + timeTaken.toString());


    } catch (e) {
        throw e;
    }
}

async function addBookmark(username, articleId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.insertOne({
            username: username,
            articleId: articleId,
            timestamp: Date.now()
        });

        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("addBookmark mongo response time: " + timeTaken.toString());


    } catch (e) {
        throw e;
    }
}

async function removeBookmark(username, articleId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.deleteOne({
            username: username,
            articleId: articleId
        });

        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("removeBookmark mongo response time: " + timeTaken.toString());


    } catch (e) {
        throw e;
    }
}


async function getBookmarks(username, limit, skip) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let bookmark = [];

        await db.aggregate([{
                $match: {
                    username: username
                }
            },
            {
                $limit: limit
            },
            {
                $skip: skip
            },
            {
                $lookup: {
                    from: 'articles',
                    localField: 'articleId',
                    foreignField: 'articleId',
                    as: "article"
                }
            }
        ]).forEach((x) => {
            logger.debug(x);
            bookmark.push(x);
        });

        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("getBookmarks mongo response time: " + timeTaken.toString());


    } catch (e) {
        throw e;
    }
}



module.exports = {
    addBookmark,
    getBookmarks,
    removeBookmark,
    createIndex
}