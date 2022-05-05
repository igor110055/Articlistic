var config = require('../../../../config');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../../../utils/logger/index')

const dbName = config.mongo.db;
const uc = 'users';
const ac = 'articles';
const {
    MDB
} = require('../client')

async function meaningful(articleId, selection, username) {

    let client;

    try {

        client = await MDB.getClient();

        let userCollection = client.db(dbName).collection(uc);
        let articlesCollection = client.db(dbName).collection(ac);

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
                var res1 = await articlesCollection.updateOne({
                    'articleId': articleId,
                    'selections.selection': selection
                }, {
                    $inc: {
                        'selections.$.mfCnt': 1
                    }
                }, {
                    session: session
                });

                var res2 = await articlesCollection.updateOne({
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
                }, {
                    session: session
                })
            } catch (e) {

                logger.error('Something wrong in transaction meaningful -1');
                await session.abortTransaction();
                throw e;
            }


            if (!res1.modifiedCount && !res2.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }


            try {
                var res3 = await userCollection.updateOne({
                    'username': username,
                    'meaningful.articleId': articleId
                }, {
                    $addToSet: {
                        'meaningful.$.selections': selection
                    }
                }, {
                    session: session
                });


                var res4 = await userCollection.updateOne({
                    'username': username,
                    'meaningful.articleId': {
                        $ne: articleId
                    },
                }, {
                    $addToSet: {
                        'meaningful': {
                            'articleId': articleId,
                            'selections': [selection]
                        }
                    }
                }, {
                    session: session
                })
            } catch (e) {

                logger.error('Something wrong in transaction meaningful -2');
                await session.abortTransaction();
                throw e;

            }


            if (!res3.modifiedCount && !res4.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("meaningful update mongo response time: " + timeTaken.toString());



        return res;

    } catch (e) {

        throw e;

    }
}




async function unmeaningful(articleId, selection, username) {

    let client;

    try {

        client = await MDB.getClient();

        let userCollection = client.db(dbName).collection(uc);
        let articlesCollection = client.db(dbName).collection(ac);

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

                var res1 = await articlesCollection.updateOne({
                    'articleId': articleId,
                    'selections.selection': selection,
                    'selections.$.mfCount': {
                        $gt: 0
                    }
                }, {
                    $inc: {
                        'selections.$.mfCnt': -1
                    }
                }, {
                    session: session
                });

            } catch (e) {

                logger.error("Something wrong with transaction in un-meaningful -1");
                await session.abortTransaction();
                throw e;

            }


            if (!res1.modifiedCount) {

                await session.abortTransaction();
                throw "Transaction error";

            }

            try {
                var res2 = await userCollection.updateOne({
                    'username': username,
                    'meaningful.articleId': articleId
                }, {
                    $pull: {
                        'meaningful.$.selections': selection
                    }
                }, {
                    session: session
                });
            } catch (e) {
                logger.error("Something wrong with transaction in un-meaningful -2");
                await session.abortTransaction();
                throw e;
            }


            if (!res2.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }

            // await userCollection.updateOne({
            //     'username': username,
            //     'meaningful.articleId': articleId,
            //     'meaningful.$[element]': {
            //         $exists: false
            //     },
            // }, 
            // {
            //     $pull: {
            //         'meaningful.articleId': articleId
            //     },
            // })

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("un-meaningful update mongo response time: " + timeTaken.toString());



        return res;

    } catch (e) {

        throw e;

    }
}


module.exports = {
    meaningful,
    unmeaningful
}