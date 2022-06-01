'use strict'

var express = require('express');

var useAuth = require('../../middleware/auth');
var file = require('../../middleware/files');

// var gzip = require('gzip');

const articleCheck = require('../../middleware/articleCheck');
var mongo = require('../../db/mongo/index')
var s3 = require('../../utils/s3/index')
const apis = require('../../utils/api/index');
const scrapeArticles = require('../../utils/scraping/articles');

const NetworkError = require('../../errors/NetworkError');
const MissingParamError = require('../../errors/MissingParamError');
const BadRequestError = require('../../errors/BadRequestError');

const DatabaseError = require('../../errors/DatabaseError');
const ServiceError = require('../../errors/ServiceError');
// const BadRequestError = require('../../errors/BadRequestError');

const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const logger = require('../../utils/logger');

const {
    v4: uuidv4
} = require('uuid');
const NotFoundError = require('../../errors/NotFoundError');
const checkDb = require('../../middleware/checkDb');
const sha224 = require('crypto-js/sha224');
const {
    IMAGE_SIZE_LIMIT,
    DELETE_AFTER_ARTICLE_TIMING
} = require('../../../constants');
const { createSingleSend, deleteSingleSend } = require('../../utils/mailer/client');


module.exports = function articlesRouter() {

    return new express.Router()
        .get('/get', useAuth(), getArticle)
        .get('/getAllArticlesForUser', useAuth(), getAllArticlesForUser)
        .get('/getArticlesForPublication', useAuth(), getArticlesForPublication)
        .get('/import', useAuth(false, false, true), importArticle)
        .get('/topFunders', useAuth(), articleCheck(), getTopFunders)


        .put('/uploadImage', useAuth(), checkDb(true, false, true), file.single('image'), uploadEmbed)
        .put('/upload', useAuth(false, false, true), uploadArticle)

        .delete('/markForDeletion', useAuth(false, false, true), checkDb(true, false, true), markForDeletion)


        // .post('/new', useAuth(), createArticleBluePrint)
        // .post('/discard', useAuth(), checkDb(true), discardArticle)

        .post('/selection/meaningful', useAuth(), checkDb(true, false), updateMeaningfulCount)
        .post('/selection/unmeaningful', useAuth(), checkDb(true, false), removeFromMeaningful)

        .get('/selection/all', useAuth(), checkDb(true, false), showAllSelectionsForArticle)
        .get('/selection/find', useAuth(), checkDb(true), findSelection)

        .post('/selection/respond', useAuth(), checkDb(true, true), respondToSelection)
        // .post('/selection/tip', useAuth(), tipSelection)
        // .post('/selection/share', useAuth(), shareSelection)

        .post('/deleteImage', useAuth(), deleteEmbed);


    async function getTopFunders(req, res) {
        const routeName = 'get top funders';
        const articleId = req.articleId;

        /**
         * MongoDB query for top funders & first funders. 
         */




    }


    async function markForDeletion(req, res) {
        const routeName = 'mark for deletion';
        const articleId = req.articleId;


        const deleteAt = Date.now() + DELETE_AFTER_ARTICLE_TIMING;


        try {
            await mongo.articles.markForDeletion(articleId, deleteAt);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'Article marked for deletion'
        })
    }



    async function importArticle(req, res) {

        const routeName = 'import article';
        const username = req.username;
        const {
            link
        } = req.query;
        let origin = 'substack';


        if (!link) throw new MissingParamError('Some parameter is missing', routeName);


        // if (link.includes('substack')) {
        //     origin = 'substack';
        // } else if (link.includes('medium')) {
        //     origin = 'medium'
        // } else {
        //     origin = 'substack'
        //     // throw new BadRequestError('Platform not supported', routeName);
        // }

        const articleId = uuidv4();


        /**
         * Do some site validation - from where it originates. 
         * Reject If it isn't in the list of our own supported platforms. 
         * Use axios to import article HTML into a variable.
         */
        let axiosRes;
        try {

            axiosRes = await apis.linkHTML.getHTMLForLink(link);

        } catch (e) {
            throw new ServiceError('axios - html', routeName, e);
        }

        /**
         * Pass axios HTML into a import article utility function
         * which returns HTML with replaced images on sub-stack.
         * It also returns article title and subtitle. 
         **/
        let scrapedArticle;

        try {
            scrapedArticle = await scrapeArticles.scrapeArticle(origin, axiosRes, articleId, username)
        } catch (e) {
            throw new ServiceError(`scrape article - ${origin}`, routeName, e);
        }


        /**
         * Save the article into the database with origin: {site: "medium", link: "---"}
         */

        return res.status(200).send({
            message: 'Success',
            articleId,
            origin,
            scrapedArticle
        })

    }



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

    /*

    async function tipSelection(req, res) {
        let username = req.username;
    }

    async function shareSelection(req, res) {
        let username = req.username;
    }

    */
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


    async function uploadEmbed(req, res) {
        let routeName = '/article/uploadImage'

        if (!req.file) {
            throw new MissingParamError('Image not uploaded.', routeName);
        }


        let buffer = req.file.buffer;
        let username = req.username;
        let articleId = req.articleId;

        let sizeLimit = IMAGE_SIZE_LIMIT;
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
        // let username = req.username;

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


        //In case user isn't the writer and it is a draft. 




        /*

        if (username != article.username) {
            try {
                await mongo.analytics.updateAnalyticsForArticleFetch(username, articleId, article.username);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }
        }
        */

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

            if (filters != "DRAFT" && filters != "PUBLISHED") throw new BadRequestError('Bad filter', routeName)
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
            count: articles.count ? articles.count : 0,
            articles: articles.articles ? articles.articles : []
        });
    }


    async function uploadArticle(req, res) {

        let routeName = '/articles/upload';
        let username = req.username;
        let articleId = req.query.articleId;
        let listId;
        try {
            const writerData = await mongo.writers.getWriterByName(username);
            logger.info(writerData);
            listId = writerData.mailing_list_id;
        }
        catch (e) {
            logger.debug(e, "Unable to fetch writer's detail at", routeName);
        }

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
            publicationId,
            newlyImported,
            origin,
            originUrl,
            canonicalUrl
        } = req.body;

        /*
        We require publication Id for uploading an article
        */

        if (newlyImported && !articleId) throw new BadRequestError('Article id is required for newly imported articles', routeName)

        if (publicationId) {
            let res = await mongo.publications.getPublication(publicationId);

            if (!res) {
                throw new NotFoundError('Publication not there/ User not allowed to do this operation', routeName);
            }

            if (res.username != username) {
                throw new NotAuthenticatedError('Not allowed to do this operation', routeName);
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

            if (newlyImported) {
                const validOrigins = ['substack', 'medium']


                if (status != "DRAFT") {

                    throw new BadRequestError('Newly imported article can not be published.', routeName)

                }

                if (!validOrigins.includes(origin)) {
                    throw new BadRequestError('Origin is not supported', routeName);

                }

                if (!originUrl) {
                    throw new BadRequestError('Origin url should be sent for newly imported articles', routeName)
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
        storySetting.canonicalUrl = canonicalUrl;
        /*
        The next few lines exist to update/insert the article in the database
        */

        if (!newArticle && !newlyImported) {
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

                    await mongo.articles.createNewArticle(username, articleId, status, writeupUpload, false, false, publicData, origin, originUrl);
                } else {
                    try {
                        await mongo.transactionArticleCategory.publishNewArticle(username, articleId, status, writeupUpload, storySetting, false, publicData, categories, publicationId);
                        await createSingleSend(username, listId);
                    }
                    catch (e) {
                        logger.info(e)
                        //await deleteSingleSend(listId);
                    }
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