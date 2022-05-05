const config = require('../../../../config')
const MongoClient = require('mongodb').MongoClient;

const dbName = config.mongo.db;
const collection = 'chats';
const mongodbUri = config.mongo.uri; // TODO: Add mongo db url here -> In config and .env file
const MDB = require('../client').MDB;

const logger = require('../../../utils/logger/index')

async function createUniquenessIndex2() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        await db.createIndex({
            'chatId': 1
        }, {
            unique: true
        });


        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("chats: createUniquenessIndex2 mongo response time: " + timeTaken.toString());

        


    } catch (e) {
        throw e;
    }
}



async function fetchChatsForUser(username, limit, skip) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let allChats = [];

        let twoMonthsMilliseconds = 60 * 24 * 60 * 60 * 1000;
        let cursor = db.find({
            $or: [{
                sender: username
            }, {
                receiver: username
            }],
            lastUpdated: {
                $gt: Date.now() - twoMonthsMilliseconds
            }
        }, {
            projection: {
                _id: 0
            }
        }).sort({
            lastUpdated: 1
        }).limit(limit).skip(skip ? skip : 0);

        await cursor.forEach((x) => {
            allChats.push(x);
        })


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("fetchChatsForUser mongo response time: " + timeTaken.toString());

        
        return allChats;


    } catch (e) {
        throw e;
    }

}




async function createNewResponse(chatId, articleId, selection, user, writer, chat) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.insertOne({
            'chatId': chatId,
            'articleId': articleId,
            'title': selection,
            'sender': user,
            'receiver': writer,
            'status': 'article-selection-response',
            'lastUpdated': Date.now(),
            //Something fishy here. 
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
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createNewResponse mongo response time: " + timeTaken.toString());

        
        return res;


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


        let res = await db.createIndex({
            sender: 1,
            receiver: 1,
            articleId: 1,
            title: 1
        }, {
            unique: true
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUniquenessIndex mongo response time: " + timeTaken.toString());

        
        return res;


    } catch (e) {
        throw e;
    }
}


async function addNewChat(chatId, chatObj) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.updateOne({
            chatId: chatId
        }, {
            $set: {
                lastUpdated: Date.now()
            },
            $push: {
                chat: chatObj
            }
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("addNewChat mongo response time: " + timeTaken.toString());

        
        return res;


    } catch (e) {
        throw e;
    }
}


module.exports = {
    createNewResponse,
    createUniquenessIndex,
    createUniquenessIndex2,
    addNewChat,
    fetchChatsForUser
}