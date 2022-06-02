var express = require('express');

// require('../../errors/customError');

var mongo = require('../../db/mongo/index');
const logger = require('../../utils/logger/index')
const s3 = require('../../utils/s3/index');


const NetworkError = require('../../errors/NetworkError');
const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const ServiceError = require('../../errors/ServiceError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const NotFoundError = require('../../errors/NotFoundError')
const BadRequestError = require('../../errors/BadRequestError')
const checkDb = require('../../middleware/checkDb');
const useAuth = require('../../middleware/auth');

const apis = require('../../utils/api/index');

const file = require('../../middleware/files')


const {
    v4: uuidv4
} = require('uuid');
const {
    IMAGE_SIZE_LIMIT,
    DELETE_AFTER_PUBLICATION_TIMING
} = require('../../../constants');
const { createSingleSend } = require('../../utils/mailer/client');


module.exports = function publicationRouter() {

    return new express.Router()
        .get('/', useAuth(), getPublication)
        .get('/all', useAuth(), getAllPublications)

        .post('/new', useAuth(false, false, true), file.single('image'), newPublication)
        .put('/', useAuth(false, false, true), file.single('image'), updatePublication)
        .delete('/', useAuth(false, false, true), checkDb(false, false, false, true, true), markForDeletion)

        .get('/article', useAuth(), getArticle)
        .put('/article', useAuth(), uploadArticle)

        .post('/article/image', useAuth(), file.single('image'), uploadImageEmbed);



    async function markForDeletion(req, res) {
        const routeName = 'mark publication for deletion';
        const publicationId = req.publicationId;
        // const twentyFourHours = ;
        const deleteAt = Date.now() + DELETE_AFTER_PUBLICATION_TIMING;

        try {
            await mongo.publications.markForDelete(publicationId, deleteAt);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'marked for deletion'
        })

    }

    async function uploadImageEmbed(req, res) {
        let routeName = '/publication/article/image';
        let username = req.username;

        let {
            publicationId,
        } = req.query;

        if (!publicationId || !req.file || !req.file.buffer) {
            throw new MissingParamError('Publication Id or Picture not present.', routeName);
        }
        let buffer = req.file.buffer;


        try {
            var pub = await mongo.publications.getPublicationForCheck(publicationId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!pub || pub.username != username) {
            throw new NotAuthenticatedError('You can not upload images for this publication.', routeName);
        }

        let sizeLimit = IMAGE_SIZE_LIMIT; //5 mbs. 
        let resLink;

        if (buffer.byteLength <= sizeLimit) {
            try {
                resLink = await s3.init().uploadImage(buffer, username, publicationId, true);
            } catch (e) {
                logger.error(e);
                throw new ServiceError('s3-publicationArticleImage-image', routeName, e);
            }
        } else {
            throw new NetworkError('Can not upload an image larger than 5mb', 500, routeName, 'Image too large');
        }

        return res.status(201).send({
            message: 'Uploaded Publication Article Image',
            link: resLink.url
        })




    }

    async function getArticle(req, res) {
        let routeName = '/publication/article/get';
        let {
            publicationId
        } = req.query;

        if (!publicationId) {
            throw new MissingParamError('Publication Id required', routeName);
        }

        try {
            var link = await mongo.publications.getPublicationArticle(publicationId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        if (!link || !link.publicationArticle) {
            throw new NotFoundError('There is no publication article', routeName);
        }

        try {
            var content = await apis.articles.getArticle(link.publicationArticle);

        } catch (e) {
            throw new ServiceError('axios-apis-getPublication-Article', routeName, e);
        }

        res.status(200).send(content);
    }


    async function getAllPublications(req, res) {
        let routeName = '/publication/all';
        let {
            username
        } = req.query;
        let publications;

        if (!username) {
            throw new MissingParamError('Username required parameter', routeName);
        }

        try {
            publications = await mongo.publications.getAllPublicationsForWriter(username);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        /*
         * This could have been at the start of the function 
         * but I did a slight optimization.
         */

        if (!publications || !publications.length) {

            try {
                var writer = await mongo.writers.getWriterByName(username);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            if (!writer) {
                throw new NotFoundError('No writer with username exists', routeName);
            }
        }


        res.status(200).send({
            message: 'fetched',
            publications: publications ? publications : []
        })
    }

    async function uploadArticle(req, res) {
        let routeName = 'publication/article'

        let username = req.username;

        let {
            publicationId,
            writeup,
            intro
        } = req.body;

        if (!publicationId || !writeup || !intro) {
            throw new MissingParamError('Publication Id or Writeup or Intro not present.', routeName);
        }

        try {
            var pub = await mongo.publications.getPublicationForCheck(publicationId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!pub || pub.username != username) {

            throw new NotAuthenticatedError('You can not make changes to this file.', routeName);
        }



        let articleBuffer = Buffer.from(writeup, 'utf8');

        try {

            var resLink = await s3.init().uploadPublicationArticle(articleBuffer, username, publicationId);

        } catch (e) {
            throw new ServiceError('s3-articles', routeName, e);
        }


        try {

            await mongo.publications.updateArticleInPublication(publicationId, resLink.url, intro);

        } catch (e) {

            await s3.init().deleteFile(resLink.fileName, true);
            throw new DatabaseError(routeName, e);
        }


        /*
         SENDING THE UPDATE TO MAIL ON SUCCESSFULL ARTICLE PUBLISHING

        try {
            const writerData = await mongo.writers.getWriterByName(username);
            const mailingId = writerData.mailing_list_id;
            await createSingleSend(username, mailingId);
        }
        catch (e) {
            logger.debug(e, "Failed to send mail", routeName);
        }
        */
        res.status(200).send({
            message: 'Updated Successfully.',
            'articleLink': resLink.url
        });
    }


    /**
     * Get a publication by its id
     * @param req - The request object.
     * @param res - The response object.
     * @returns The publication object.
     */

    async function getPublication(req, res) {
        let routeName = '/get/publication';

        let {
            publicationId
        } = req.query;

        if (!publicationId) throw new MissingParamError('Missing publication Id', routeName)

        try {
            var publication = await mongo.publications.getPublication(publicationId);

        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!publication) {
            throw new NotFoundError('Could not find any publication.', routeName);
        }

        return res.status(200).send(publication);
    }

    /**
     * Update a publication's name and/or image
     * @param req - The request object.
     * @param res - Response object
     */


    async function updatePublication(req, res) {
        let routeName = '/publication/update';
        let sizeLimit = IMAGE_SIZE_LIMIT;
        let username = req.username;
        let buffer = req.file ? req.file.buffer : null;

        let {
            name,
            publicationId,
            publicationOneLiner
        } = req.query;

        if (!name && !buffer) {
            throw new BadRequestError('Nothing to update', routeName)
        }

        /*
        Checking required parameters
        */

        if (!publicationId) {
            throw new MissingParamError('Publication id required', routeName)
        }


        if (publicationOneLiner && publicationOneLiner.length < 255) {
            throw new BadRequestError('Minimum length of one liner is 255');
        }

        try {
            var pub = await mongo.publications.getPublicationForCheck(publicationId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        /*
        Checking authorization permissions or if a publication exists or not.
        */

        if (!pub || pub.username != username) {
            throw new NotAuthenticatedError('You can not make changes to this file.', routeName);
        }

        /*
        Checking if there is something to update or not .
        */


        if ((!buffer && !name) || (name == pub.publicationName && !buffer)) {
            return res.status(200).send({
                message: 'Nothing to update.'
            })
        }



        let resLink;

        if (buffer) {

            /*
            Uploading image and checking size limit. 
            */

            if (buffer.byteLength <= sizeLimit) {

                try {
                    resLink = await s3.init().uploadImage(buffer, username, publicationId);
                } catch (e) {
                    logger.error(e);
                    throw new ServiceError('s3-publication-image', routeName, e);
                }

                if (!resLink || !resLink.url) {
                    throw new ServiceError('s3-articles-image', routeName, 'Res Link empty');
                }

            } else {

                throw new NetworkError('Can not upload an image larger than 5mb', 500, routeName, 'Image too large');

            }

            /*

            if the image is uploaded and returns a resLink & the earlier link is the same as the present. Send it back as it is. 
            if the resLink results in NULL return back with error. 
            */

            if (!resLink || !resLink.url) {
                throw new ServiceError('s3-publication-pic', routeName, 'Picture is null');
            }


            if ((!name || name == pub.publicationName) && resLink.url == pub.publicationPic) {
                return res.status(200).send({
                    message: 'Success',
                    publicationPic: resLink.url
                });
            }


        }

        /*

        Just handy-response stuff happening here. 

        */

        let publicationPic = resLink ? resLink.url : undefined;
        let publicationName = name;

        try {
            await mongo.transactionPublicationWriter.updatePublication(publicationId, publicationName, publicationPic, username, publicationOneLiner);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            'message': 'Updated Successfully',
            publicationId,
            publicationName,
            publicationPic
        })


    }

    async function newPublication(req, res) {
        let routeName = '/publication/new';

        let username = req.username;

        let buffer = req.file ? req.file.buffer : null;

        let {
            name,
            publicationOneLiner
        } = req.query;

        if (!name) throw new MissingParamError("Name is required", routeName)


        if (publicationOneLiner && publicationOneLiner.length < 255) {
            throw new BadRequestError('Minimum length of one liner is 255');
        }

        let sizeLimit = IMAGE_SIZE_LIMIT;

        let resLink;
        let publicationId = uuidv4();


        if (buffer) {
            if (buffer.byteLength <= sizeLimit) {
                try {
                    resLink = await s3.init().uploadImage(buffer, username, publicationId);
                } catch (e) {
                    logger.error(e);
                    throw new ServiceError('s3-publication-image', routeName, e);
                }

                if (!resLink || !resLink.url) {
                    throw new ServiceError('s3-articles-image', routeName, 'Res Link empty');
                }
            } else {

                throw new NetworkError('Can not upload an image larger than 5mb', 500, routeName, 'Image too large');

            }

        }

        let publicationPic = resLink ? resLink.url : undefined;
        let publicationName = name;

        if (!publicationPic && !publicationName) {
            res.status(200).send({
                message: 'Nothing to update'
            });
        }



        try {

            await mongo.transactionPublicationWriter.createPublication(publicationId, name.trim(), publicationPic, username, publicationOneLiner);

        } catch (e) {

            //Delete Image Here. 
            if (resLink) {

                try {

                    await s3.init().deleteFile(resLink.fileName, true);
                } catch (e) {
                    logger.fatal(e);
                    throw new ServiceError('s3-publication-deleteImage', routeName, e);
                }
            }

            throw new DatabaseError(routeName, e);
        }


        res.status(201).send({
            'message': 'Created new publication',
            publicationId,
            publicationName: name,
            publicationPic,
            publicationOneLiner
        })


    }
}