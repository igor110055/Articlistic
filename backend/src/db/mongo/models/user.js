var config = require('../../../../config');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = 'users';
const mongodbUri = config.mongo.uri;

async function createUniquenessIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);


        let startTime = Date.now();

        await db.createIndex({
            'username': 1
        }, {
            unique: true
        });


        await db.createIndex({
            'email': 1
        }, {
            unique: true
        });


        await db.createIndex({
            'phone': 1
        }, {
            unique: true
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUniquenessIndex - user -  mongo response time: " + timeTaken.toString());



        return 'done';

    } catch (e) {
        throw e;
    }
}


async function updatePrivateField(username, private) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            username: username
        }, {
            $set: {
                'private': private
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updatePrivateField mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}


async function createUser(user) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let response = await db.insertOne(user);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUser mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}

async function updateUserProfile(username, profilePic, about, name, place) {
    let client;

    if (!username) throw "updateUserProfile: no username";
    let update = {};

    if (profilePic) {
        update.profilePic = profilePic;
    }
    if (about) {
        update.about = about;
    }

    if (name) {
        update.name = name;
    }

    if (place) {
        update.place = place;
    }


    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let response = await db.updateOne({
            username
        }, {
            $set: update
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateUserProfile mongo response time: " + timeTaken.toString());

        return response;

    } catch (e) {
        throw e;
    }
}


async function updateMeaningfulForUser(username, articleId, selection) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            'username': username,
            'meaningful.articleId': articleId
        }, {
            $addToSet: {
                'meaningful.$.selections': selection
            }
        });


        let res2 = await db.updateOne({
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
        })


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateMeaningfulForUser mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}


async function deleteMeaningfulForUser(username, articleId, selection) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            'username': username,
            'meaningful.articleId': articleId
        }, {
            $pull: {
                'meaningful.$.selections': selection
            }
        });


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUser mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}

// async function deleteUser(username) {

//     let client;

//     try {

//         client = await MDB.getClient();
//         let db = client.db(dbName).collection(collection);

//         let startTime = Date.now();

//         let response = await db.deleteOne({
//             'username': username
//         });

//         let endTime = Date.now();

//         let timeTaken = endTime - startTime;

//         logger.info("deleteuser mongo response time: " + timeTaken.toString());

//         

//         return response;

//     } catch (e) {
//         throw e;
//     }
// }


async function findUserUsingRefreshToken(refreshToken) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.findOne({
            'refreshToken': refreshToken
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("findUserUsingRefreshToken mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }



}



async function updateUserMapInterest(username, categories, following) {

    /* Onboarding Info -> 

    {
        _id: ObjectID("some_object_id_created_by_mongo"),
        "id_hashed_using_username" : {
        "profile_picture": "url of profile pic"   

        "public": {
        "username": "dxt",
        "name": "Yas Dixit",
        "image": "img@s3.jpg",
        "following": [username1, ...]
        "categories": ["#write", "#now"]
                            }

        "private": {
        "email": "yash@attentioun.com",
        "phone": "9315859952",
        "password": "hashed_password",
        }
    }
    }


    */

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let response = await db.updateOne({
            "username": username
        }, {
            $set: {
                "public.categories": categories,
                "public.following": following
            }
        });


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("updateUserMapInterest mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}


/*
Read documentation about this function before using
*/

async function getUser(entity, username, email, phone) {

    let client;

    try {
        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response;

        if (username) {

            response = await db.findOne({
                'username': entity
            });

        } else if (email) {

            response = await db.findOne({
                'email': entity
            });

        } else if (phone) {

            response = await db.findOne({
                'phone': entity
            });

        }

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getUser mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}

async function getUserByUsername(username) {
    let client;

    try {
        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response;


        response = await db.findOne({
            username
        }, {
            projection: {
                username: 1,
                isWriter: 1,
                name: 1
            }
        });



        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getUser mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}


async function getUserProfile(username) {
    let client;

    try {
        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response;

        response = await db.findOne({
            'username': username
        }, {
            projection: {
                ' _id': 0,
                'public': 0,
                'private': 0,
                'email': 0,
                'phone': 0,
                'refreshToken': 0,
                'bookmarks': 0
            }
        })


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getUserProfile mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}


async function addBookmark(articleId, username) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let response = await db.updateOne({
            "username": username
        }, {
            $addToSet: {
                'bookmarks': articleId
            }
        });


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("addBookmark mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}


async function removeBookmark(articleId, username) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let response = await db.updateOne({
            "username": username
        }, {
            $pull: {
                'bookmarks': articleId
            }
        });


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("removeBookmark mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}


async function addFollowedWriter(writer, username) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let response = await db.updateOne({
            "username": username
        }, {
            $addToSet: {
                'public.following': writer
            }
        });


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("addFollowedWriter mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}


async function unfollowWriter(writer, username) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let response = await db.updateOne({
            "username": username
        }, {
            $pull: {
                'public.following': writer
            }
        });


        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("unfollowWriter mongo response time: " + timeTaken.toString());


        return response;


    } catch (e) {
        throw e;
    }
}

module.exports = {
    getUser,
    updateUserMapInterest,
    createUser,
    findUserUsingRefreshToken,
    createUniquenessIndex,
    updatePrivateField,
    addBookmark,
    addFollowedWriter,
    updateMeaningfulForUser,
    unfollowWriter,
    deleteMeaningfulForUser,
    getUserProfile,
    getUserByUsername,
    updateUserProfile
}