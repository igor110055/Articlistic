const aws = require('aws-sdk');
const config = require('../../../config');
const logger = require('../logger');
const {
    gzip,
    ungzip
} = require('node-gzip');

let dirForImages = "images/";
let dirForArticles = "articles/"

let dirForProfile = "/profile/"
let dirForPublication = "/publications/"

const articlesBucket = config.aws.s3BucketArticles;
const profileBucket = config.aws.s3BucketProfile;



let urlForArticles = config.aws.urlForArticles
let urlForProfile = config.aws.urlForProfile

var s3;

function __init() {
    if (!s3) {
        s3 = new aws.S3({
            accessKeyId: config.aws.accessId,
            secretAccessKey: config.aws.secretKey,
            maxRetries: 7,
            region: config.aws.region,
            retryDelayOptions: {
                base: 2400
            },
            signatureVersion: 'v4'
        });
    }

    return {
        uploadArticle: uploadArticle,
        uploadImage: uploadImage,
        uploadArticleImageEmbed: uploadImageEmbed,
        uploadPublicationArticle: uploadPublicationArticle,
        deleteFile: deleteFile
    }
}


async function uploadPublicationArticle(buffer, username, publicationId) {
    let fileName = username + dirForPublication + 'articles/' + publicationId + '.gzip';

    /*

    yash-dxt/publications/articles/publicationId

    */
    try {
        var compressedFile = await gzip(buffer);
    } catch (e) {
        throw {
            error: e,
            message: 'Could not compress'
        }
    }
    await uploadFileFromStream(compressedFile, fileName, profileBucket);

    return {
        url: `${urlForProfile}${fileName}`,
        fileName
    }

}


/*

    Upload publication/profile related stuff. 

*/

async function uploadImage(buffer, username, publicationId, publicationImage = false) {
    let startTime = new Date();
    let fileName;

    if (publicationId) {

        if (publicationImage) {

            fileName = username + dirForPublication + 'articleImages/' + Date.now().toString() + '.png'

        } else {

            fileName = username + dirForPublication + 'images/' + publicationId + '.png'

        }


    } else {
        fileName = username + dirForProfile + 'profile.png';
    }


    /*

    The filename is this: 
    username/publications/images/publicationId.png
    username/profile/profile.png

    */

    await uploadFileFromStream(buffer, fileName, profileBucket);

    let endTime = new Date();

    logger.info(`AWS S3 upload image - profile - time taken for file - ${fileName} = ${endTime - startTime} `);

    return {
        url: urlForProfile + fileName,
        fileName: fileName
    };

}



async function deleteFile(fileName, profile) {
    let startTime = new Date();

    let uploadParams = {
        Bucket: profile ? config.aws.s3BucketProfile : config.aws.s3BucketArticles,
        Key: fileName
    }

    let res = await s3.deleteObject(uploadParams).promise();

    let endTime = new Date();

    logger.info(`AWS S3 delete time taken for file - ${fileName} = ${endTime - startTime} `);

    return res;
}

async function uploadArticle(buffer, username, articleId) {
    let fileName = dirForArticles + username + "/" + articleId + '.gzip';
    try {
        var compressedFile = await gzip(buffer);
    } catch (e) {
        throw {
            error: e,
            message: 'Could not compress'
        }
    }
    await uploadFileFromStream(compressedFile, fileName, articlesBucket);


    return {
        url: `${urlForArticles}${fileName}`,
        fileName
    }

}


async function uploadImageEmbed(buffer, username, articleId) {
    let fileName = dirForImages + `${articleId}/` + username + "_" + Date.now().toString() + ".png";
    await uploadFileFromStream(buffer, fileName, articlesBucket);
    return `${urlForArticles}${fileName}`;
}



async function uploadFileFromStream(buffer, fileName, bucket) {
    let startTime = new Date();
    let uploadParams = {
        Bucket: bucket,
        Body: buffer,
        Key: fileName
    }

    let res = await s3.upload(uploadParams).promise();

    let endTime = new Date();

    logger.info(`AWS S3 upload time taken for file - ${fileName} = ${endTime - startTime} `);

    return res;

}


module.exports = {
    init: __init
}