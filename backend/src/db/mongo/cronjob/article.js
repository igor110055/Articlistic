const config = require('../../../../config');
const {
    MDB_COLLECTION_ARTICLES
} = require('../../../../constants');
const logger = require('../../../utils/logger');

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_ARTICLES;
const alertCollection = 'alert-cronjob'
const MDB = require('../client').MDB;

async function createDeletedAtIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        await db.createIndex({
            'deleteAt': 1
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("articles: createDeleteAt mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

async function deleteS3FileFailAlert(articleId, username) {
    let client;
    let insertObj = {};

    if (!articleId || !username) throw new Error("Article Id | username should not be missing for this query - delete S3 fail alert.");

    insertObj.alertType = 'article-deletion-alert';
    insertObj.articleId = articleId;
    insertObj.username = username;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(alertCollection);

        let startTime = Date.now();


        await db.insertOne(insertObj);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("articles: alert del mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}


async function deleteArticles(listOfArticleIds = []) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        await db.deleteMany({
            articleId: {
                $in: listOfArticleIds
            }
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("articles: deleteArticles mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

async function getArticlesMarkedForDeletion(deleteAtTime) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let articles = [];

        await db.find({
            deleteAt: {
                $lt: deleteAtTime
            }
        }, {
            projection: {
                articleId: 1,
                username: 1
            }
        }).forEach((x) => {
            logger.debug(x);
            articles.push(x);
        });



        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("articles: getArticlesMarkedForDeletion mongo response time: " + timeTaken.toString());


        return articles;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

async function getArticlesForPublication(publicationId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let articles = [];

        await db.find({
            publicationId: publicationId
        }, {
            projection: {
                articleId: 1,
                username: 1
            }
        }).forEach((x) => {
            articles.push(x);
        });



        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("articles: getArticlesForPublication mongo response time: " + timeTaken.toString());


        return articles;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

module.exports = {
    deleteArticles,
    getArticlesMarkedForDeletion,
    createDeletedAtIndex,
    deleteS3FileFailAlert,
    getArticlesForPublication
}