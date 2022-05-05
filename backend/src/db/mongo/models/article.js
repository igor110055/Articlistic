var config = require('../../../../config');
const MongoClient = require('mongodb').MongoClient;

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;


const {
    gzip,
    ungzip
} = require('node-gzip');

const zlib = require('zlib');


const dbName = config.mongo.db;
const collection = 'articles';
const mongodbUri = config.mongo.uri; // TODO: Add mongo db url here -> In config and .env file

async function createUniquenessIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        await db.createIndex({
            'articleId': 1
        }, {
            unique: true
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("articles: createUniquenessIndex mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        throw e;
    }
}



async function createArticleBluePrint(username, articleId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.insertOne({
            'username': username,
            'status': 'BLUEPRINT',
            'articleId': articleId,
            'createdAt': Date.now()
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createArticleBluePrint mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}

async function selectionNewChat(selection, chatId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateOne({
            'articleId': articleId,
            'selections.selection': selection
        }, {
            $inc: {
                'selection.$.mfCnt': increment ? 1 : -1
            }
        }, {
            upsert: false,
            multi: true
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("selectionNewChat mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}


async function updateSelectionMeaningful(articleId, selection, increment) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        /* 
        talk about the edge case here
        Similar to analytics - update calls (2)
        */

        await db.updateOne({
            'articleId': articleId,
            'selections.selection': selection
        }, {
            $inc: {
                'selections.$.mfCnt': increment
            }
        });

        await db.updateOne({
            'articleId': articleId,
            'selections.selection': {
                $ne: selection
            },
        }, {
            $addToSet: {
                'selections': {
                    'selection': selection,
                    'mfCnt': 1
                }
            }
        })


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateSelectionMeaningful mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        throw e;
    }
}


async function addChatToArticle(articleId, chatId, selection) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateOne({
            'articleId': articleId,
            'selections.selection': selection
        }, {
            $addToSet: {
                'selections.$.responses': chatId
            }
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("addChatToArticle mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}


async function updateSelectionShareCount(articleId, selection, facebook, twitter, linkedin) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateOne({
            'articleId': articleId,
            'selections.selection': selection
        }, {
            $inc: {
                'selection.$.shrCnt.twitter': twitter ? 1 : 0,
                'selection.$.shrCnt.facebook': facebook ? 1 : 0,
                'selection.$.shrCnt.linkedin': linkedin ? 1 : 0
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateSelectionShareCount mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}

async function discardArticle(articleId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.deleteOne({
            'articleId': articleId
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("discardArticle mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}



async function getAllArticlesForUser(username, filters, limit, skip) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        const articles = [];

        let cursor = db.find({
            'username': username,
            'status': {
                $in: filters
            }
        }, {
            projection: {
                "writeup": 0,
                "storySetting": 0,
                "selections": 0
            },
            sort: {
                "_id": -1
            }
        });


        let count = await cursor.count()

        await cursor.skip(skip).limit(limit).forEach((x) => {
            articles.push(x);
        });



        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getAllArticlesForUser mongo response time: " + timeTaken.toString());


        return {
            articles,
            count
        };


    } catch (e) {
        throw e;
    }
}






async function updateArticle(articleId, status, writeup, storySetting, earlyAccess = false, public) {

    let updateParam = {};
    updateParam.earlyAccess = earlyAccess;
    if (status) {
        updateParam.status = status;
    }
    if (writeup) {
        updateParam.writeup = writeup;
    }
    if (storySetting) {
        updateParam.storySetting = storySetting;
    }

    if (public) {
        updateParam.public = public
    }

    updateParam.lastUpdated = Date.now()

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateOne({
            'articleId': articleId
        }, {
            $set: updateParam
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateArticle mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }


}



async function createNewArticle(username, articleId, status, writeup, storySetting, earlyAccess = false, public) {

    let updateParam = {};
    updateParam.earlyAccess = earlyAccess;
    updateParam.username = username;
    updateParam.articleId = articleId;

    if (status) {
        updateParam.status = status;
    }
    if (writeup) {
        updateParam.writeup = writeup;
    }
    if (storySetting) {
        updateParam.storySetting = storySetting;
    }

    if (public) {
        updateParam.public = public
    }

    updateParam.createdAt = Date.now()

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.insertOne(updateParam);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateArticle mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }

}




async function getArticleById(articleId) {
    let client;

    try {

        client = await MDB.getClient();
        // if (!client) {
        //     client = await MDB.getClient()
        // }
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.findOne({
            'articleId': articleId
        });


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getArticleById mongo response time: " + timeTaken.toString());

        return res;


    } catch (e) {
        throw e;
    }
}



async function getArticleForWriters(writers, limit, skip) {

    if (!limit) limit = 5;
    if (!skip) skip = 0;

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = [];

        await db.find({
            'username': {
                $in: writers
            }
        }, {
            projection: {
                _id: 0,
                writeup: 0
            }
        }).sort({
            _id: -1
        }).limit(limit).skip(skip).forEach((x) => {
            res.push(x);
        });

        // await cursor.
        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.debug(res);

        logger.info("getArticleForWriters mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}

async function getArticlesForPublication(publicationId, limit, skip) {


    if (!limit) limit = 5;
    if (!skip) skip = 0;

    let client;
    logger.debug(publicationId);
    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = [];

        await db.find({
            publicationId: publicationId
        }).limit(limit).skip(skip).forEach((x) => {
            res.push(x);
        })


        let endTime = Date.now();

        let timeTaken = endTime - startTime;


        logger.info("getArticlesForPublication mongo response time: " + timeTaken.toString());

        return res;


    } catch (e) {
        throw e;
    }
}



module.exports = {
    createArticleBluePrint,
    getArticleById,
    updateArticle,
    discardArticle,
    getAllArticlesForUser,
    updateSelectionMeaningful,
    selectionNewChat,
    addChatToArticle,
    getArticleForWriters,
    createUniquenessIndex,
    createNewArticle,
    getArticlesForPublication
}