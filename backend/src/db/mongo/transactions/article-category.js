var config = require('../../../../config');
const {
    MDB_COLLECTION_ARTICLES,
    MDB_COLLECTION_PUBLICATIONS,
    MDB_COLLECTION_CATEGORY,
    MDB_COLLECTION_WRITERS
} = require('../../../../constants');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../../../utils/logger/index')

const dbName = config.mongo.db;
const cc = MDB_COLLECTION_CATEGORY;
const ac = MDB_COLLECTION_ARTICLES;
const pc = MDB_COLLECTION_PUBLICATIONS
const wc = MDB_COLLECTION_WRITERS;

const mongodbUri = config.mongo.uri;
const {
    MDB
} = require('../client')



async function updatePublishedArticle(articleId, status, writeup, storySetting, earlyAccess = false, pub, categories, publicationId) {

    let client;
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
    if (pub) {
        updateParam.public = pub
    }
    if (!publicationId) {
        throw "PublicationId is required"
    }
    if (publicationId) {
        updateParam.publicationId = publicationId;
    }




    updateParam.lastUpdated = Date.now()



    try {

        client = await MDB.getClient();

        let articlesCollection = client.db(dbName).collection(ac);
        let categoriesCollection = client.db(dbName).collection(cc);
        let writersCollection = client.db(dbName).collection(wc);

        let startTime = Date.now();

        const session = client.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: {
                level: 'local'
            },
            writeConcern: {
                w: 'majority'
            }
        }




        var res = await session.withTransaction(async () => {

            try {
                var articlesUpdate = await articlesCollection.updateOne({
                    'articleId': articleId
                }, {
                    $set: updateParam
                }, {
                    session: session
                });
            } catch (e) {

                await session.abortTransaction();
                logger.info("Transaction failed - article category-1");
                throw e;

            }

            if (!articlesUpdate.modifiedCount) {

                await session.abortTransaction();
                throw "Transaction error - 1 - update article";
            }
            const bulk = categoriesCollection.initializeUnorderedBulkOp();

            categories.forEach((x) => bulk.find({
                name: x,
            }).upsert().updateOne({
                $set: {
                    name: x
                }
            }));


            try {

                await bulk.execute({
                    session: session
                });

            } catch (e) {

                await session.abortTransaction();
                logger.info("Transaction failed - article category-2");
                throw e;

            }

            try {
                await writersCollection.updateOne({
                    publicationId
                }, {
                    $addToSet: {
                        categories: {
                            $each: categories
                        }
                    }
                }, {
                    session: session
                });
            } catch (e) {
                await session.abortTransaction();
                throw "Update Article MongoDB: Writers Push Categories";
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updatePublishedArticle mongo response time: " + timeTaken.toString());


        return res;

    } catch (e) {

        throw e;

    }
}

async function publishNewArticle(username, articleId, status, writeup, storySetting, earlyAccess = false, pub, categories, publicationId) {

    let client;
    let updateParam = {};
    updateParam.earlyAccess = earlyAccess;
    updateParam.articleId = articleId;
    updateParam.username = username;
    if (status) {
        updateParam.status = status;
    }
    if (writeup) {
        updateParam.writeup = writeup;
    }
    if (storySetting) {
        updateParam.storySetting = storySetting;
    }
    if (pub) {
        updateParam.public = pub
    }
    if (!publicationId) {
        throw "PublicationId is required"
    }
    updateParam.createdAt = Date.now()
    updateParam.publicationId = publicationId;
    updateParam.lastUpdated = Date.now();


    try {

        client = await MDB.getClient();

        let articlesCollection = client.db(dbName).collection(ac);
        let categoriesCollection = client.db(dbName).collection(cc);
        let writersCollection = client.db(dbName).collection(wc);

        let startTime = Date.now();

        const session = client.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: {
                level: 'local'
            },
            writeConcern: {
                w: 'majority'
            }
        }




        var res = await session.withTransaction(async () => {

            try {
                var articlesUpdate = await articlesCollection.insertOne(updateParam, {
                    session: session
                });
            } catch (e) {

                await session.abortTransaction();
                logger.info("Transaction failed - article category-1");
                throw e;

            }

            if (!articlesUpdate.insertedId) {

                await session.abortTransaction();
                throw "Transaction error";
            }

            const bulk = categoriesCollection.initializeUnorderedBulkOp();


            categories.forEach((x) => bulk.find({
                name: x,
            }).upsert().updateOne({
                $set: {
                    name: x
                }
            }));

            try {

                var bulkOp = await bulk.execute({
                    session: session
                });

            } catch (e) {

                await session.abortTransaction();
                logger.info("Transaction failed - article category-2");
                throw e;

            }

            try {
                var resPublication = await writersCollection.updateOne({
                    publicationId
                }, {
                    $addToSet: {
                        categories: {
                            $each: categories
                        }
                    }
                }, {
                    session: session
                });
            } catch (e) {
                await session.abortTransaction();
                logger.info('Transaction Failed- category writers push')
                throw e;
            }

            // if (!resPublication.modifiedCount) {
            //     await session.abortTransaction();
            //     throw "Transaction error - 2 insert article to publication";
            // }


        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("publishNewArticle mongo response time: " + timeTaken.toString());


        return res;

    } catch (e) {

        throw e;

    }
}


module.exports = {
    updatePublishedArticle,
    publishNewArticle
}