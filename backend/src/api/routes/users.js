var express = require('express');

// require('../../errors/customError');

var mongo = require('../../db/mongo/index');
var redis = require('../../db/redis/index');

const logger = require('../../utils/logger/index')
var file = require('../../middleware/files');
const Sentry = require('@sentry/node');
const mailClient = require("../../utils/mailer/client");

const useAuth = require('../../middleware/auth')
const {
    staticDecrypt
} = require("../../utils/encryption/encryption")
const NetworkError = require('../../errors/NetworkError');
const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const ServiceError = require('../../errors/ServiceError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const NotFoundError = require('../../errors/NotFoundError')
const checkDb = require('../../middleware/checkDb');

const getTopFollowed = require('../../utils/functions/getTopFollowed');
const s3 = require('../../utils/s3');
const {
    followNotificationMail
} = require('../../utils/mailer/email');
const {
    email
} = require('../../utils/otp');

module.exports = function userRouter() {

    return new express.Router()
        .post('/follow', useAuth(false, false, false, true), followWriter)
        .delete('/unfollow', useAuth(false, false, false, true), unfollowWriter)
        .get('/following', useAuth(), getFollowing)
        .get('/followers', useAuth(), getFollowers)
        .get('/name', getNameByUsername)


        .post('/bookmark', useAuth(), checkDb(true), bookmarkArticle)
        .delete('/bookmark', useAuth(), checkDb(true), removeBookmark)
        .get('/bookmarks', useAuth(), getBookmarksForUser)

        .put('/profile', useAuth(), file.single('image'), editProfile)

        .get('/profile/my', useAuth(), getWriterProfile)
        .get('/profile', getProfile)

        .get('/homepage', useAuth(), getHomePage)

        .get('/chats', useAuth(), getChatsForUser);



    /*

    -- User Profile APIs

    */

    async function getWriterProfile(req, res) {
        const routeName = 'get writer profile';
        const username = req.username;

        try {
            var writer = await mongo.writers.getWriterProfile(username, true);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        return res.status(200).send({
            writer
        })
    }


    async function getNameByUsername(req, res) {
        let routeName = 'getNameByUsername';


        let {
            username
        } = req.query;


        let name;

        try {
            name = await redis.name.getName(username);
        } catch (e) {
            throw new DatabaseError(routeName, e)
        }




        if (!name) {
            try {
                name = await mongo.users.getUserByUsername(username);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            if (!name) {
                throw new NotFoundError('No User with Username found', routeName);
            } else {
                name = name.name;
                try {
                    await redis.name.setName(username, name);

                } catch (e) {
                    Sentry.captureException('Redis DB not working to set name: ' + name + 'for username' + username);

                    logger.fatal("Redis db not working in set username " + e.toString());
                }
            }
        }

        res.status(200).send({
            message: 'success',
            username,
            name
        })

    }

    async function editProfile(req, res) {
        let routeName = '/profile/edit'
        let username = req.username;
        let buffer = req.file ? req.file.buffer : null;
        let {
            about,
            place,
            name
        } = req.query;

        if (!buffer && !name && !place && !about) {
            throw new MissingParamError('Nothing to update', routeName);
        }



        if (buffer) {
            try {
                var resLink = await s3.init().uploadImage(buffer, username);
            } catch (e) {
                throw new ServiceError('s3-profile-upload', routeName, e)
            }
        }


        try {
            await mongo.users.updateUserProfile(username, resLink ? resLink.url : resLink, about, name, place);
        } catch (e) {

            if (resLink) {

                await s3.init().deleteFile(resLink.fileName, true);

            }
            throw new DatabaseError(routeName, e);
        }

        if (name) {

            try {
                await redis.name.setName(username, name);
            } catch (e) {
                Sentry.captureException('Redis DB not working to set name: ' + name + 'for username' + username);
            }

        }

        let profilePic = resLink ? resLink.url : resLink;

        return res.status(200).send({
            'message': 'Successfully updated.',
            profilePic,
            name,
            place,
            about
        });
    }

    async function getProfile(req, res) {
        let routeName = '/profile/get'
        let {
            username
        } = req.query;

        if (!username) {
            throw new MissingParamError('Username required', routeName);
        }

        try {
            var user = await mongo.users.getUserProfile(username);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!user) {
            throw new NotFoundError('User not found with the username.', routeName);
        }


        if (user.isWriter) {
            user.writerSection = await mongo.writers.getWriterProfile(username);
        }

        return res.status(200).send(user);
        //MongoDB query to fetch user. 

    }


    /*

    -- Bookmark Article APIs. 

    */

    async function bookmarkArticle(req, res) {
        let routeName = 'user/bookmark/add'

        let articleId = req.articleId;
        let username = req.username;

        try {
            await mongo.bookmarks.addBookmark(username, articleId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(201).send({
            'message': 'done'
        })

    }

    async function getBookmarksForUser(req, res) {
        let routeName = '/bookmark/get';
        let username = req.username;
        let {
            limit,
            skip
        } = req.query;

        if (!limit) limit = 8;
        if (!skip) skip = 0;

        limit = parseInt(limit);
        skip = parseInt(skip);

        try {
            var bookmarks = await mongo.bookmarks.getBookmarks(username, limit, skip);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        res.status(200).send({
            message: 'Fetched bookmarks',
            bookmarks
        })

    }

    async function removeBookmark(req, res) {
        let articleId = req.articleId;
        let username = req.username;
        let routeName = '/bookmark/remove'


        try {
            await mongo.bookmarks.removeBookmark(username, articleId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        return res.status(201).send({
            'message': 'Removed bookmark'
        })

    }


    /*

    -- Follower APIs

    */

    async function followWriter(req, res) {
        let routeName = 'POST /users/follow'

        let follows = req.query.follows;
        let username = req.username;
        let email = staticDecrypt(req.user.email);
        let name = req.user.name;
        // logger.info(req.user)
        if (!follows) throw new MissingParamError('Missing parameter: follows', routeName);

        if (username == follows) throw new NotAuthenticatedError('You can not follow yourself', routeName);


        try {
            var x = await mongo.users.getUserByUsername(follows);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        if (!x) throw new NotFoundError('User to be followed does not exist', routeName);

        let isWriter = x.isWriter ? true : false;

        try {
            await mongo.followers.follow(username, follows, isWriter);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        //CHECKING THE FOLLOWING OF USER AND SENDING THE MAIL IF ITS FIRST FOLLOWING
        try {
            const userfollowing = await mongo.followers.getFollowing(username);
            logger.info(userfollowing, userfollowing.length);
            if (userfollowing.length == 1) {
                try {
                    await followNotificationMail(email, follows);
                } catch (e) {
                    logger.debug(e, "Error in sending the follow notification mail")
                }
            }
        } catch (e) {
            logger.debug(e, "First following check failed");
        }

        //Adding the follower to Writer's Mailing List
        try {
            const writerData = await mongo.writers.getWriterByName(follows);
            const mailListId = writerData.mailing_list_id;
            if (mailListId) {
                await mailClient.addFollowerToList(email, mailListId, name);
            } else {
                logger.info("Mailing list id does not exist! Signup again to get your email notification working")
            }

        } catch (e) {
            logger.info(e, "Failed to add to mailing List");
        }
        return res.status(201).send({
            'message': 'Followed the writer'
        })

    }

    async function unfollowWriter(req, res) {
        let routeName = '/users/unfollow'

        let follows = req.query.follows;
        let username = req.username;
        let email = staticDecrypt(req.user.email)
        if (!follows) throw new MissingParamError('Missing parameter: follows', routeName);

        try {
            await mongo.followers.unfollow(username, follows);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }
        try {
            const writerData = await mongo.writers.getWriterByName(follows)
            const mailListId = writerData.mailing_list_id;
            if (mailListId) {
                try {
                    await mailClient.removeFromList(mailListId, email)
                } catch (e) {
                    logger.debug(e, "Failed to remove writer from mailing list--", routeName)
                }
            } else {
                logger.info(`Mailing list is doesn't exist for Writer-${follows}!`)
            }
        } catch (e) {
            logger.debug(e, "--Unable to fetch writers Detail--", routeName)
        }
        return res.status(201).send({
            'message': 'Unfollow successful.'
        })

    }

    async function getFollowing(req, res) {
        let routeName = 'user/getFollowing'

        let {
            username,
            limit,
            skip
        } = req.query;

        if (!username) throw new MissingParamError('Username not present')

        if (!limit) limit = 10;
        if (!skip) skip = 0;

        limit = parseInt(limit);
        skip = parseInt(skip);

        try {
            var following = await mongo.followers.getFollowing(username, limit, skip)
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        res.status(200).send({
            following
        });

    }

    async function getFollowers(req, res) {
        let routeName = 'user/getFollowers';

        let {
            username,
            limit,
            skip
        } = req.query;

        if (!username) throw new MissingParamError('Username is undefined', routeName);

        if (!limit) limit = 10;
        if (!skip) skip = 0;

        limit = parseInt(limit);
        skip = parseInt(skip);

        try {
            var followers = await mongo.followers.getFollowers(username, limit, skip)
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }
        logger.info(followers);
        res.status(200).send({
            followers
        });
    }

    /*

    -- Homepage APIs

    */

    async function getHomePage(req, res) {
        let routeName = 'users/homepage/get'
        let username = req.username;

        let {
            limit,
            skip
        } = req.query;

        limit = parseInt(limit);
        skip = parseInt(skip);


        try {

            var following = await mongo.followers.getFollowedWriters(username, limit, skip);

        } catch (e) {

            logger.debug(e);
            throw new DatabaseError(routeName, e);
        }

        let homepageData = [];


        following.forEach((x) => {

            homepageData.push(mongo.articles.getAllArticlesForUser(x, ["PUBLISHED"], 5, 0))

        })


        homepageData = await Promise.all(homepageData);

        let result = {};

        for (let i = 0; i < following.length; i++) {

            result[following[i].follows] = homepageData[i];
            result[following[i].follows]['userData'] = following[i].writerDetails;

        }

        return res.status(200).send({
            'message': 'Fetched data successfully',
            result
        });

    }




    async function getChatsForUser(req, res) {

        let routeName = '/chats/get';
        let username = req.username;

        let {
            limit,
            skip
        } = req.query;

        if (!limit) limit = 5;
        if (!skip) skip = 0;

        limit = parseInt(limit);
        skip = parseInt(skip)

        try {
            var chats = await mongo.chats.fetchChatsForUser(username, limit, skip);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'Successful',
            chats
        })


    }



}