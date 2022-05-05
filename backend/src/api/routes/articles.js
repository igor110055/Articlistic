'use strict'

var express = require('express');

var useAuth = require('../../middleware/auth');
var file = require('../../middleware/files');

// var gzip = require('gzip');


var mongo = require('../../db/mongo/index')
var s3 = require('../../utils/s3/index')
const apis = require('../../utils/api/index');

const NetworkError = require('../../errors/NetworkError');
const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const ServiceError = require('../../errors/ServiceError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const logger = require('../../utils/logger');

const {
    v4: uuidv4
} = require('uuid');
const NotFoundError = require('../../errors/NotFoundError');
const checkDb = require('../../middleware/checkDb');
const sha224 = require('crypto-js/sha224');


module.exports = function articlesRouter() {

    return new express.Router()
        .get('/get', useAuth(), getArticle)
        .get('/getAllArticlesForUser', useAuth(), getAllArticlesForUser)
        .get('/getArticlesForPublication', useAuth(), getArticlesForPublication)

        .put('/uploadImage', useAuth(), checkDb(true), file.single('image'), uploadEmbed)
        .put('/upload', useAuth(false, false, true), uploadArticle)

        // .post('/new', useAuth(), createArticleBluePrint)
        // .post('/discard', useAuth(), checkDb(true), discardArticle)

        .post('/selection/meaningful', useAuth(), checkDb(true, false), updateMeaningfulCount)
        .post('/selection/unmeaningful', useAuth(), checkDb(true, false), removeFromMeaningful)

        .get('/selection/all', useAuth(), checkDb(true, false), showAllSelectionsForArticle)

        .get('/selection/find', useAuth(), checkDb(true), findSelection)

        .post('/selection/respond', useAuth(), checkDb(true, true), respondToSelection)
        .post('/selection/tip', useAuth(), tipSelection)
        .post('/selection/share', useAuth(), shareSelection)

        .post('/deleteImage', useAuth(), deleteEmbed);



    async function getArticlesForPublication(req, res) {


        let routeName = '/getArticlesForPublication'
        let {
            publicationId,
            limit,
            skip
        } = req.query;

        if (!publicationId || !limit || !skip) {
            throw new MissingParamError("Some parameters are missing - check limit, skip or publicationId", routeName);
        }


        limit = parseInt(limit);
        skip = parseInt(skip);

        try {
            var articles = await mongo.articles.getArticlesForPublication(publicationId, limit, skip)
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'Fetched articles for publication',
            articles
        })


    }


    async function tipSelection(req, res) {
        let username = req.username;
    }

    async function shareSelection(req, res) {
        let username = req.username;
    }


    async function findSelection(req, res) {
        let routeName = '/selection/find';
        let articleId = req.articleId;
        let selection = req.query.selection;

        if (!articleId || !selection) {
            throw new MissingParamError('articleId and selection is required', routeName);
        }

        let selections;
        try {
            selections = await mongo.selection.findSelection(articleId, selection);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        return res.status(200).send({
            message: 'Successfully found!',
            selections
        })



    }

    async function showAllSelectionsForArticle(req, res) {
        let routeName = '/selection/all'
        let articleId = req.articleId;

        if (!articleId) {
            throw new MissingParamError('Did not get article.')
        }

        let selections;
        try {
            selections = await mongo.selection.getArticleSelections(articleId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }
        return res.status(200).send({
            message: 'Successfully found!',
            selections
        })

    }


    async function removeFromMeaningful(req, res) {

        let routeName = '/selection/meaningful/remove';

        let {
            selection
        } = req.query;


        if (!selection) {
            throw new MissingParamError('Please provide params', routeName);
        }

        let username = req.username;
        let articleId = req.articleId;

        try {
            await mongo.selection.unmarkMeaningful(username, articleId, selection.trim());
        } catch (error) {
            throw new DatabaseError(routeName, error);
        }

        return res.status(200).send({
            'message': 'Successfully updated'
        })
    }


    async function updateMeaningfulCount(req, res) {

        let routeName = '/selection/meaningful/update';

        let {
            selection
        } = req.query;


        if (!selection) {
            throw new MissingParamError('Please provide params', routeName);
        }

        let username = req.username;
        let articleId = req.articleId;

        try {
            await mongo.selection.markMeaningful(username, articleId, selection.trim());
        } catch (error) {
            throw new DatabaseError(routeName, error);
        }

        return res.status(200).send({
            'message': 'Successfully updated'
        })
    }

    async function respondToSelection(req, res) {
        let routeName = '/selection/respond';
        let {
            selection,
            response
        } = req.body;

        let writer = req.writer;
        let articleId = req.articleId;
        let username = req.username;

        if (!selection || !response) {
            throw new MissingParamError('Required params - missing.', routeName);
        }
        let chatId = uuidv4();

        try {
            await mongo.transactionArticleChat.newResponse(chatId, articleId, selection, username, writer, response);
        } catch (e) {
            // Get new response if not  - push
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'Successfully added response.',
            chatId
        })
    }

    /*
    async function discardArticle(req, res) {
        let routeName = '/articles/discard';
        let articleId = req.articleId;

        try {
            var article = await mongo.articles.getArticleById(articleId);
        } catch (error) {
            throw new DatabaseError(routeName, error);
        }

        if (!article || article.status != "BLUEPRINT") {
            throw new NotAuthenticatedError('Not allowed to operate this on drafts/published articles', routeName);
        }

        try {
            await mongo.articles.discardArticle(articleId);
        } catch (error) {
            throw new DatabaseError(routeName, error);
        }

        return res.status(201).send({
            'message': 'Article deleted successfully'
        })
    }

    */



    async function uploadEmbed(req, res) {
        let routeName = '/article/uploadImage'

        if (!req.file) {
            throw new MissingParamError('Image not uploaded.', routeName);
        }


        let buffer = req.file.buffer;



        let username = req.username;
        let articleId = req.articleId;

        let sizeLimit = 5 * 1024 * 1024; //5 mbs. 
        let resLink;

        if (buffer.byteLength <= sizeLimit) {
            try {
                resLink = await s3.init().uploadArticleImageEmbed(buffer, username, articleId);
            } catch (e) {
                logger.error(e);
                throw new ServiceError('s3-articles-image', routeName, e);
            }
        } else {
            throw new NetworkError('Can not upload an image larger than 5mb', 500, routeName, 'Image too large');
        }



        return res.status(201).send({
            'message': 'Picture uploaded successfully.',
            'image': resLink
        });

    }

    async function deleteEmbed(req, res) {
        let routeName = '/article/deleteEmbed';
        let fileName = req.query.fileName;

        try {
            await s3.init().deleteFile(fileName);
        } catch (e) {
            logger.error(e);
            throw new ServiceError('s3-articles-image', routeName, e);
        }


        return res.status(200).send({
            'message': 'Picture deleted successfully.'
        });
    }

    async function getArticle(req, res) {
        let routeName = '/articles/get';
        let {
            articleId
        } = req.query;
        let username = req.username;

        if (!articleId) {
            throw new MissingParamError('Missing article id', routeName);
        }


        let article;
        try {
            article = await mongo.articles.getArticleById(articleId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!article) {
            throw new NotFoundError('Article not found.', routeName);
        }


        if (article.status != "BLUEPRINT") {
            let s3link = article.writeup;

            try {
                let data = await apis.articles.getArticle(s3link);
                article.writeup = data;
            } catch (e) {
                throw new ServiceError('axios get json article data', routeName, e);
            }

        }

        if (username != article.username) {
            try {
                await mongo.analytics.updateAnalyticsForArticleFetch(username, articleId, article.username);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }
        }

        res.status(200).send({
            message: 'Article found',
            article
        })

    }

    async function getAllArticlesForUser(req, res) {
        let routeName = '/articles/getAllArticlesForUser';
        let username = req.username;
        let {
            filters,
            limit,
            skip
        } = req.query;


        if (!filters) {
            filters = ["DRAFT", "PUBLISHED"]
        } else {
            filters = [filters];
        }


        if (!limit) limit = 8;
        if (!skip) skip = 0;

        limit = parseInt(limit);
        skip = parseInt(skip)


        try {
            var articles = await mongo.articles.getAllArticlesForUser(username, filters, limit, skip);
        } catch (e) {
            throw new DatabaseError(routeName, e)
        }

        return res.status(200).send({
            'message': 'Fetched articles',
            count: articles.count,
            articles: articles.articles
        });
    }

    /*
        async function createArticleBluePrint(req, res) {

            let routeName = '/articles/new';

            let username = req.username;
            let articleId = uuidv4();

            try {
                await mongo.articles.createArticleBluePrint(username, articleId);
            } catch (error) {
                throw new DatabaseError(routeName, error);
            }

            return res.status(200).send({
                'message': 'Success',
                articleId
            });

        }
    */
    async function uploadArticle(req, res) {

        let routeName = '/articles/upload';
        let username = req.username;
        let articleId = req.query.articleId;


        let {
            readingTime,
            articlePic,
            title,
            body,
            date,
            writeup,
            writerName,
            categories,
            status,
            earlyAccess,
            earlyAccessLastDate,
            publicationId
        } = req.body;

        /*
        We require publication Id for uploading an article
        */

        if (publicationId) {
            let res = await mongo.publications.getPublication(publicationId);

            if (!res || res.username != username) {
                throw new NotFoundError('Publication not there/ User not allowed to do this operation', routeName);
            }
        }


        /* 

        Some validations - checking if there is a status or writeup - if there isn't throw an error. 

        */

        if (!status || !writeup) {
            throw new MissingParamError('Mandatory parameters missing', routeName);
        }

        let validStatus = ["DRAFT", "PUBLISHED"];


        /*
        Some more validations - 
        In case Draft - check nothing
        else check everything because it's at the state of almost published or published
        */


        if (!validStatus.includes(status)) {
            throw new MissingParamError('Parameter status is not valid', routeName);
        } else {


            if (status != "DRAFT") {
                /*

                These are then parameters that are required for a 'PUBLISHED' article.

                */


                if (!categories || !categories.length || !readingTime || !title || !body || !date || !articlePic || !writerName) {
                    throw new MissingParamError('Categories should be present if status = PUBLISHED, check: writer, title, readingTime, articlePic, earlyAccess, date, earlyAccessLastDate if earlyAccess is true', routeName);
                }
                categories = categories.map(x => x.toLowerCase());
            }

        }

        if (!articleId) {

            var newArticle = true;
            articleId = uuidv4();

            if (status == "PUBLISHED" && !publicationId) {
                throw new MissingParamError('Publication Id required for creating new article', routeName);
            }

        } else {


            /*
            This is for the ownership of the article
            */

            newArticle = false;
            let articleCheck;
            try {
                articleCheck = await mongo.articles.getArticleById(articleId);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            if (!articleCheck) {
                throw new NotFoundError('Could not find article', routeName);
            }

            if (articleCheck.username != username) {
                throw new NotAuthenticatedError('You are not allowed to change the article. ', routeName);
            }

            if (articleCheck.status == "PUBLISHED" && status != "PUBLISHED") {
                throw new NotAuthenticatedError('You can not change a published article to another type', routeName);
            }

        }


        /* 
        Checking out how early access works - it's false for now.  
        */

        if (earlyAccess) {
            if (!earlyAccessLastDate) {
                throw new MissingParamError('Last date parameter missing', routeName);
            }
            var earlyAccessObject = {
                'earlyAccess': earlyAccess,
                'lastDate': earlyAccessLastDate
            };
        }

        /*
        Modeling the object to be uploaded and to be stored in the db. 
        */


        let writeupUpload;
        let s3Link;
        let storySetting = {};

        var publicData = {
            writerName,
            readingTime,
            title,
            body,
            date,
            articlePic
        };

        let articleBuffer = Buffer.from(writeup, 'utf8'); // Convert article json/string into a buffer. 

        /*
        Add an article to category. 
        Just in case it's a draft - don't 
        */

        let fn;
        try {

            s3Link = await s3.init().uploadArticle(articleBuffer, username, articleId);
            writeupUpload = s3Link.url;
            fn = s3Link.fileName;

        } catch (e) {
            //Delete the article from category just in case it was not a draft. 

            throw new ServiceError('s3-article-upload', routeName, e)
        }


        // We don't have much in case of story settings, we'll just add the categories. 
        storySetting.categories = categories;

        /*
        The next few lines exist to update/insert the article in the database
        */

        if (!newArticle) {
            try {
                if (status == "DRAFT") {
                    /*
                        In case of drafts we don't have story settings so we don't need to deal with many collections. Only the article collection will suffice. 
                    */
                    await mongo.articles.updateArticle(articleId, status, writeupUpload, false, false, publicData);
                } else {

                    await mongo.transactionArticleCategory.updatePublishedArticle(articleId, status, writeupUpload, storySetting, false, publicData, categories, publicationId);
                }
            } catch (e) {
                // await s3.init().deleteFile(fn);
                throw new DatabaseError(routeName, e);
            }
        } else {
            try {
                if (status == "DRAFT") {
                    /*
                        In case of drafts we don't have story settings. 
                    */
                    await mongo.articles.createNewArticle(username, articleId, status, writeupUpload, false, false, publicData);
                } else {

                    await mongo.transactionArticleCategory.publishNewArticle(username, articleId, status, writeupUpload, storySetting, false, publicData, categories, publicationId);
                }
            } catch (e) {
                // await s3.init().deleteFile(fn);
                throw new DatabaseError(routeName, e);
            }
        }

        res.status(200).send({
            message: 'Success.',
            articleId
        });
    }
}