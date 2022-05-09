var config = require('../../../../config');
const {
    MDB_COLLECTION_USERS
} = require('../../../../constants');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_USERS;

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

async function setContactId(username, contactId) {
    if (!username || !contactId) {
        throw "Contact ID & username is required";
    }

    try {


        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.updateOne({
            username: username
        }, {
            $set: {
                'wallet.contactId': contactId
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Set contact id mongoDB: " + timeTaken.toString());

        return 'success';


    } catch (e) {
        throw e;
    }


}

async function resetPIN(username, newPin) {
    if (!username || !newPin) {
        throw "newPin & username is required";
    }

    try {


        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.updateOne({
            username: username
        }, {
            $set: {
                'wallet.pin': newPin,
                'wallet.pinRetries': 0,
                'wallet.cooldown': 0,
                'wallet.ban': false
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Set new PIN mongoDB: " + timeTaken.toString());

        return 'success';


    } catch (e) {
        throw e;
    }
}


async function setFundAccount(username, faId, faDetails) {

    if (!username || !faId || !faDetails) {
        throw "Fund account id & details & username is required";
    }

    try {


        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.updateOne({
            username: username
        }, {
            $set: {
                'wallet.faId': faId,
                'wallet.faDetails': [faDetails]
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Set fund account mongoDB: " + timeTaken.toString());

        return 'success';


    } catch (e) {
        throw e;
    }


}

async function activateWallet(username, pin) {

    if (!username || !pin) {
        throw "Username & Pin Required for activating wallet";
    }

    const walletObj = {
        credits: 0,
        pin: pin,
        status: 'activated',
        locked: false,
        lastUpdated: Date.now()
    }

    try {


        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.updateOne({
            username: username
        }, {
            $set: {
                'wallet': walletObj
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Activate wallet mongo response time: " + timeTaken.toString());

        return 'success';

    } catch (e) {
        throw e;
    }

}

async function banAccount(username) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            username: username
        }, {
            $set: {
                'wallet.ban': true
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("banAccount mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}

async function setCooldown(username, cooldownTill) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            username: username
        }, {
            $set: {
                'wallet.cooldown': cooldownTill
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("setCooldown mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}


async function incrementPinRetry(username) {
    let client;

    logger.debug(username);

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            username: username
        }, {
            $inc: {
                'wallet.pinRetries': 1
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("incrementPinRetry mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}


async function makeRetriesDefault(username) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            username: username
        }, {
            $set: {
                'wallet.pinRetries': 0
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("makeRetriesDefault mongo response time: " + timeTaken.toString());



        return response;

    } catch (e) {
        throw e;
    }
}


async function updatePrivateField(username, p) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let response = await db.updateOne({
            username: username
        }, {
            $set: {
                'private': p
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



// async function updateUserMapInterest(username, categories, following) {

//     /* Onboarding Info -> 

//     {
//         _id: ObjectID("some_object_id_created_by_mongo"),
//         "id_hashed_using_username" : {
//         "profile_picture": "url of profile pic"   

//         "public": {
//         "username": "dxt",
//         "name": "Yas Dixit",
//         "image": "img@s3.jpg",
//         "following": [username1, ...]
//         "categories": ["#write", "#now"]
//                             }

//         "private": {
//         "email": "yash@attentioun.com",
//         "phone": "9315859952",
//         "password": "hashed_password",
//         }
//     }
//     }


//     */

//     let client;

//     try {

//         client = await MDB.getClient();
//         let db = client.db(dbName).collection(collection);

//         let startTime = Date.now();


//         let response = await db.updateOne({
//             "username": username
//         }, {
//             $set: {
//                 "public.categories": categories,
//                 "public.following": following
//             }
//         });


//         let endTime = Date.now();

//         let timeTaken = endTime - startTime;

//         logger.info("updateUserMapInterest mongo response time: " + timeTaken.toString());


//         return response;


//     } catch (e) {
//         throw e;
//     }
// }


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



module.exports = {
    getUser,
    createUser,
    findUserUsingRefreshToken,
    createUniquenessIndex,
    updatePrivateField,
    getUserProfile,
    resetPIN,
    getUserByUsername,
    updateUserProfile,
    activateWallet,
    setContactId,
    setFundAccount,
    banAccount,
    setCooldown,
    incrementPinRetry,
    makeRetriesDefault
}