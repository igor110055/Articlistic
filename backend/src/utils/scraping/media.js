const s3 = require('../s3/index')
const axios = require('axios');
const logger = require('../logger');



async function convertMultipleImagesLinksToS3(listOfImages = [], articleId, username) {
    const res = [];

    for (let i = 0; i < listOfImages.length; i++) {
        let image = await convertLinkToS3Image(listOfImages[i], articleId, username);
        //Can optimize.
        res.push(image);
    }

    return res;

}


async function convertLinkToS3Image(url, articleId, username) {
    let response = await axios.get(url, {
        responseType: 'arraybuffer'
    });

    const res = await s3.init().uploadArticleImageEmbed(response.data, username, articleId);

    return res;

}

module.exports = {
    convertMultipleImagesLinksToS3
}