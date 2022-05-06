var config = require('../../../../config');
const {
    MDB_COLLECTION_ARTICLES,
    MDB_COLLECTION_CHATS
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')

const dbName = config.mongo.db;
const cc = MDB_COLLECTION_CHATS;
const ac = MDB_COLLECTION_ARTICLES;

const {
    MDB
} = require('../client')


async function newResponse(chatId, articleId, selection, user, writer, chat) {

    let client;

    try {

        client = await MDB.getClient();

        let chatsCollection = client.db(dbName).collection(cc);
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
                var res1 = await chatsCollection.insertOne({
                    'chatId': chatId,
                    'articleId': articleId,
                    'title': selection,
                    'sender': user,
                    'receiver': writer,
                    'status': 'article-selection-response',
                    'lastUpdated': Date.now(),
                    'chats': [{
                        username: user,
                        message: selection,
                        timestamp: Date.now(),
                        likes: 0
                    }, {
                        username: user,
                        message: chat,
                        timestamp: Date.now(),
                        likes: 0
                    }]
                }, {
                    session: session
                });
            } catch (e) {

                logger.error("Transaction failed new response -1");
                await session.abortTransaction();
                throw e;

            }

            if (!res1.insertedId) {
                await session.abortTransaction();
                throw "Transaction failed";
            }

            try {
                var res2 = await articlesCollection.updateOne({
                    'articleId': articleId,
                    'selections.selection': selection
                }, {
                    $addToSet: {
                        'selections.$.responses': chatId
                    }
                }, {
                    session: session
                })
            } catch (e) {
                logger.error("Transaction failed new response -2");
                await session.abortTransaction();
                throw e;
            }

            if (!res2.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction failed";
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("newResponse update mongo response time: " + timeTaken.toString());



        return res;

    } catch (e) {

        throw e;

    }
}


module.exports = {
    newResponse
}