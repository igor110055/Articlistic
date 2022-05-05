// import {
//     createClient
// } from 'redis';



const logger = require('../../../utils/logger');

const {
    RDB
} = require('../client')


async function setName(username, name) {

    let startTime = Date.now();

    const client = await RDB.getClient();
    try {

        await client.SET(username, name);

    } catch (e) {
        logger.error(e);
        throw e;
    }


    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("username to name set - redis: " + timeTaken.toString() + "ms");
    return 1;
}


async function getName(username) {

    if (!username) throw "Username required"
    let startTime = Date.now();
    const client = await RDB.getClient();

    try {
        var res = await client.GET(username);
    } catch (e) {
        throw e;
    }


    if (!res) {
        logger.debug("ISN'T MEMBER");
        return false;
    }


    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("username to name get - redis: " + timeTaken.toString() + "ms");
    return res;
}

module.exports = {
    getName,
    setName
}