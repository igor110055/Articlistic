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
        deleteFile: deleteFile,
        deleteAllImagesRelatedToArticle: deleteAllImagesRelatedToArticle,
        deleteArticle: deleteArticle,
        fullDeletePublication: fullDeletePublication,
        fullDeleteArticle: fullDeleteArticle
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

async function uploadImage(buffer, username, publicationId, publicationArticleImage = false) {
    let startTime = new Date();
    let fileName;

    if (publicationId) {

        if (publicationArticleImage) {

            fileName = username + dirForPublication + 'articleImages/' + publicationId + '.png'

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

async function del(fileName, bucket) {
    let startTime = new Date();

    let uploadParams = {
        Bucket: bucket,
        Key: fileName
    }

    let res = await s3.deleteObject(uploadParams).promise();

    let endTime = new Date();

    logger.info(`AWS S3 del time taken for file - ${fileName} = ${endTime - startTime} `);

    return res;
}

async function deleteArticleImage() {

}

async function deleteAllArticleImages() {

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

async function deleteAllImagesRelatedToArticle(articleId) {
    let fileName = dirForImages + `${articleId}/`;
    try {
        await del(fileName, articlesBucket);
    } catch (e) {
        throw e;
    }
    return 'success';
}

async function deleteArticle(username, articleId) {
    let fileName = dirForArticles + username + "/" + articleId + '.gzip';
    try {
        await del(fileName, articlesBucket);
    } catch (e) {
        throw e;
    }
    return 'success';

}




async function deleteMultipleFiles(files = [], bucket) {

    let startTime = new Date();

    const uploadParams = {
        Bucket: bucket,
        Delete: {
            Objects: files
        }
    };


    let res = await s3.deleteObjects(uploadParams).promise();

    let endTime = new Date();

    logger.info(`AWS S3 delete multiple files time taken for file ${endTime - startTime}ms `);

    return res;

}

async function fullDeletePublication(username, publicationId) {
    const publicationArticleDir = username + dirForPublication + 'articles/' + publicationId + '.gzip';
    const publicationImagesDir = username + dirForPublication + 'images/' + publicationId + '.png';
    const publicationArticleImagesDir = username + dirForPublication + 'articleImages/' + publicationId + '.png';


    const files = [{
        Key: publicationArticleDir
    }, {
        Key: publicationImagesDir
    }, {
        Key: publicationArticleImagesDir
    }];

    try {
        await deleteMultipleFiles(files, profileBucket);
    } catch (e) {
        logger.debug(e);
        throw e;
    }
}






async function fullDeleteArticle(username, articleId) {
    const articleDir = dirForArticles + username + "/" + articleId + '.gzip';;

    const files = [{
        Key: articleDir
    }];


    const imagesDir = dirForImages + articleId + '/';
    const listParams = {
        Bucket: articlesBucket,
        Prefix: imagesDir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length != 0) {

        /**
         * Some slick JS code to extract Key from List of maps & then add array 
         * with name file as {Key: 'file Name'}
         */

        listedObjects.Contents.forEach(({
            Key
        }) => {
            files.push({
                Key
            });
        });


    }


    try {
        await deleteMultipleFiles(files, articlesBucket);
    } catch (e) {
        throw e;
    }
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