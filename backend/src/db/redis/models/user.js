// import {
//     createClient
// } from 'redis';


const config = require('../../../../config');
const logger = require('../../../utils/logger');

const {
    RDB
} = require('../client')

const collection = 'usernames';


async function push(username) {

    let startTime = Date.now();

    const client = await RDB.getClient();
    try {

        let res = await client.SADD(collection, username)
        logger.debug(res);

    } catch (e) {
        logger.error(e);
        throw e;
    }


    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("username push - redis: " + timeTaken.toString() + "ms");
    return 1;
}


async function check(username) {


    let startTime = Date.now();
    const client = await RDB.getClient();

    try {
        var res = await client.SISMEMBER(collection, username);
    } catch (e) {
        throw e;
    }


    if (!res) {
        logger.debug("ISN'T MEMBER");
        return false;
    }


    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("username check - redis: " + timeTaken.toString() + "ms");
    return 1;
}

module.exports = {
    push,
    check
}