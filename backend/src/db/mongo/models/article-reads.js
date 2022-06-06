var config = require('../../../../config');
const {
    MDB_COLLECTION_ARTICLE_READS
} = require('../../../../constants');
const {
    getDateInAnalyticsFormat
} = require('../../../utils/date/getDateInAnalyticsFormat');

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;


const dbName = config.mongo.db;
const collection = MDB_COLLECTION_ARTICLE_READS;


async function incrementRead(articleId) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();



        const property = getDateInAnalyticsFormat()
        const incrementStatement = {};
        incrementStatement[property] = 1;


        await db.updateOne({
            articleId
        }, {
            $inc: incrementStatement
        }, {
            upsert: true
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("incrementRead mongo response time: " + timeTaken.toString());




    } catch (e) {
        throw e;
    }
}


async function getReadsForSpecificArticle(articleId) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        const analytics = await db.findOne({
            articleId
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getReadsForSpecificArticle mongo response time: " + timeTaken.toString());

        delete analytics._id;
        delete analytics.articleId;

        return analytics;



    } catch (e) {
        throw e;
    }

}


module.exports = {
    incrementRead,
    getReadsForSpecificArticle
}