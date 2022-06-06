const {
    RDB_CLOUDWATCH_NEXT_TOKEN
} = require('../../../../constants');
const logger = require('../../../utils/logger');

const {
    RDB
} = require('../client')


async function setCloudwatchNextToken(token) {

    let startTime = Date.now();

    const client = await RDB.getClient();
    try {

        await client.SET(RDB_CLOUDWATCH_NEXT_TOKEN, token);

    } catch (e) {
        logger.error(e);
        throw e;
    }


    let endTime = Date.now();

    let timeTaken = endTime - startTime;

    logger.info("username to name set - redis: " + timeTaken.toString() + "ms");
    return 1;
}


async function getCloudwatchNextToken() {

    let startTime = Date.now();
    const client = await RDB.getClient();

    try {
        var res = await client.GET(RDB_CLOUDWATCH_NEXT_TOKEN);
    } catch (e) {
        throw e;
    }

    let endTime = Date.now();

    let timeTaken = endTime - startTime;
    logger.debug(res);
    logger.info("username to name get - redis: " + timeTaken.toString() + "ms");
    return res;
}






module.exports = {
    getCloudwatchNextToken,
    setCloudwatchNextToken
}