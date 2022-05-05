const {
    gzip,
    ungzip
} = require('node-gzip');
var fs = require('fs');
var axios = require('axios').default;

const logger = require('../logger');

async function getArticle(link) {
    let startTime = Date.now();
    const body = (await axios.get(link, {
        responseType: 'arraybuffer',
    })).data;
    let res = (await ungzip(body)).toString();

    let endTime = Date.now();
    logger.info("Time taken GET axios - " + (endTime - startTime).toString() + "ms")
    return res;
}



module.exports = {
    getArticle
}