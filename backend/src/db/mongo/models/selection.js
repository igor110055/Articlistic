var config = require('../../../../config');
const {
    MDB_COLLECTION_SELECTION
} = require('../../../../constants');

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_SELECTION;

async function markMeaningful(username, articleId, selection) {

    if (!username || !articleId || !selection) {
        throw "Required parameters while marking meaningful: username, articleId, selection"
    }

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateMany({
            selection: selection,
            articleId: articleId,

        }, {
            $addToSet: {
                meaningful: username
            },
            $inc: {
                meaningfulCount: 1
            }
        }, {
            upsert: true
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("markMeaningful - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }

}




async function unmarkMeaningful(username, articleId, selection) {

    if (!username || !articleId || !selection) {
        throw "Required parameters while unmarking meaningful: username, articleId, selection"
    }

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateMany({
            selection: selection,
            articleId: articleId,
            meaningfulCount: {
                $gt: 0
            }

        }, {
            $pull: {
                meaningful: username
            },
            $inc: {
                meaningfulCount: -1
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("unmarkMeaningful - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }

}


async function getArticleSelections(articleId) {
    if (!articleId) {
        throw "Required: articleId"
    }

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let selections = []

        await db.find({
            articleId: articleId
        }).forEach((x) => {
            selections.push(x);
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getArticleSelections - mongo response time: " + timeTaken.toString());

        return selections;


    } catch (e) {
        throw e;
    }
}


async function findSelection(articleId, selection) {
    if (!articleId || !selection) {
        throw "Required: articleId, selection - find Selection"
    }

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let selections = []

        await db.find({
            articleId: articleId,
            selection: `/${selection}/`
        }).collation({
            locale: 'en',
            strength: 2
        }).forEach((x) => {
            selection.push(x);
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("findSelection - mongo response time: " + timeTaken.toString());

        return selections;


    } catch (e) {
        throw e;
    }
}




async function createCollationIndex() {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let selections = []

        /*

        locale is the language which is english for our selections in articles. 
        strength = 2 -> Case Insensitive. 


        */

        await db.createIndex({
            articleId: 1,
            selection: 1
        }, {
            collation: {
                locale: 'en',
                strength: 2
            }
        })


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createCollationIndex - mongo response time: " + timeTaken.toString());

        return selections;


    } catch (e) {
        throw e;
    }
}

module.exports = {
    unmarkMeaningful,
    markMeaningful,
    getArticleSelections,
    createCollationIndex,
    findSelection
}