var config = require('../../../../config');
const dbName = config.mongo.db;
const MDB = require('../client').MDB;

const logger = require('../../../utils/logger/index')

const collection = 'analytics';
// TODO: Add mongo db url here -> In config and .env file



async function getUserAnalytics(username) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            'username': username
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getUserAnalytics mongo response time: " + timeTaken.toString());

        return res;

    } catch (e) {
        throw e;
    }
}

async function newUser(username) {
    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.insertOne({
            'username': username,
            'writers': [],
            'articles': []
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("newUser mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}


async function createUniquenessIndex() {
    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();



        await db.createIndex({
            'username': 1
        }, {
            unique: true
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("analytics: createUniquenessIndex - mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        throw e;
    }
}

async function updateAnalyticsForArticleFetch(username, articleId, writer) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        /*
        Review required here. 

        What's happening here? 
        The first query just adds 1 to each writer.article_visit and no of visits on article. 
        In case there is no such existence of either writer or article. 
        See next query: It creates a new element with articleId and writerId

        */
        let res = await db.updateOne({
            'username': username,
            'writers.name': writer,
            'articles.articleId': articleId
        }, {
            $inc: {
                'writers.$.article_visits': 1,
                'articles.$.no_of_visits': 1
            }
        });

        await db.updateOne({
            'username': username,
            'writers.name': {
                $ne: writer
            },
            'articles.articleId': {
                $ne: articleId
            }
        }, {
            $addToSet: {
                'articles': {
                    'articleId': articleId,
                    'writer': writer,
                    'no_of_visits': 1
                },
                'writers': {
                    'name': writer,
                    'profile_visits': 1,
                    'article_visits': 1
                }
            }

        })


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateAnalyticsForArticleFetch mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}


async function updateAnalyticsForWriterFetch(username, writer) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        /*
        What's happening here? 
        Check last query - It's similar you'll get the hang of it. 
        */

        let res = await db.updateOne({
            'username': username,
            'writers.name': writer
        }, {
            $inc: {
                'writers.$.profile_visits': 1
            }
        });

        await db.updateOne({
            'username': username,
            'writers.name': {
                $ne: writer
            }
        }, {
            $addToSet: {
                'writers': {
                    'name': writer,
                    'profile_visits': 1,
                    'article_visits': 1
                }
            }
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateAnalyticsForWriterFetch mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }


}

module.exports = {
    getUserAnalytics,
    updateAnalyticsForArticleFetch,
    updateAnalyticsForWriterFetch,
    createUniquenessIndex,
    newUser
}