// import {
//     createClient
// } from 'redis';


var {
    RDB
} = require('../client')
const config = require('../../../../config');
const logger = require('../../../utils/logger');

const collection = 'blacklist';


async function push(token, expiryInSeconds) {
    //Please see that expiryInSeconds is only here, elsewhere in the project dates are dealt in milliseconds.

    let startTime = Date.now();

    const client = await RDB.getClient();

    // Z ADD once to tokens collection. That is with a score of expiry. Set the token. 

    try {

        let res = await client.ZADD(collection, {
            value: token,
            score: expiryInSeconds
        })
        logger.debug(res);


    } catch (e) {
        logger.error(e);
        throw e;
    }

    //ZREMRANGEBYSCORE once from 0 to current timestamp. This removes all the tokens which have expired already. 


    let nowInSeconds = Math.floor((Date.now() / 1000));

    try {

        let res2 = await client.ZREMRANGEBYSCORE(collection, 0, nowInSeconds)
        logger.debug(res2);

    } catch (e) {
        logger.error(e);

        /*
        Why? You ask, we don't throw an error here because... this procedure isn't that mandatory. 
        */

    }

    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("Blacklist token push: - redis " + timeTaken.toString() + "ms");
    return 1;
}




async function check(token) {


    let startTime = Date.now();

    const client = await RDB.getClient();
    // await client.connect();

    try {
        var res = await client.ZRANK(collection, token);
    } catch (e) {
        throw e;
    }

    if (res == null || !res) {
        return false;
    }

    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("Blacklist token check - redis: " + timeTaken.toString() + "ms");
    return 1;
}


module.exports = {
    push,
    check
}