const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');
const logger = require('../../../../utils/logger');

const fs = require('fs');
const path = require('path');

const {
    jwt,
    decryptForFrontend,
    encrypt
} = require('../../../../utils/encryption');

const email = 'test1@gmail.com';
const username = 'test-user';
const international = false;
const name = 'sam';
const phone = '9315859952'
const password = 'Default@123'
let id;
let encryptedAccessToken;
let publicationId;



beforeEach(async () => {
    /* This is a way to create a user and add a phone number and email to the user. */
    id = await mongo.security.createUserAddEmail(email);
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        password,
        phone,
        name,
        international,
        id
    });
    /* This is a way to get the access token for the user. */

    let accessToken = jwt.sign(username);
    accessToken = await decryptForFrontend(accessToken);
    encryptedAccessToken = encrypt(accessToken);


    /*
     * This is used to create a publication with images. 
     * Which will in turn be used by the get API in the response.
     */

    const res = await request(app).post('/publication/').query({
            name: 'My First Publication'
        })
        .set('Authorization', encryptedAccessToken).expect(201);

    publicationId = res.body.publicationId;

})



it('Responds 400/404 in case missing/bad parameters in case (general/DRAFT)', async () => {

    //Writeup Missing/articles/upload

    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            status: 'DRAFT'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(400);

    // console.log(rep);
    //Status missing
    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",

        })
        .set('Authorization', encryptedAccessToken)
        .expect(400);

    // Status is not valid
    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: "SOMETHING NOT DRAFT OR PUBLISHED"

        })
        .set('Authorization', encryptedAccessToken)
        .expect(400);


    // Wrong article ID
    await request(app).put('/articles/upload').query({
            articleId: 'some-random-articleId'
        }).send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: "DRAFT",
        })
        .set('Authorization', encryptedAccessToken)
        .expect(404);


});

it('Responds 400 in case missing/bad parameters in case PUBLISHED', async () => {


    //Required parameter - publicationId


    //Required parameter - publication should exist

    //Required parameters -> categories


    //Required parameters -> categories not empty


    //Required param -> readingTime


    //Required param -> title


    //Required param -> body 


    //Required param -> articlePic 


    //Required param -> writerName (username)

});




it('Responds 401 in case publication or article is not of user', async () => {

    // Article ID isn't of the user


    //Publication doesn't exist


    //Published article trying to be changed to a draft


});


it('Responds 200 in case new article -> Draft', async () => {

    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(200);

});


it('Responds 200 in case new article -> Published', async () => {

    await request(app).put('/articles/upload').send({
            readingTime: 27.99,
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            title: 'A Published Article',
            body: 'some body to you',
            date: Date.now(),
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            writerName: username,
            categories: ['travel', 'demo'],
            status: 'PUBLISHED',
            publicationId
        })
        .set('Authorization', encryptedAccessToken)
        .expect(200);


});



it('Responds 200 in case DRAFT article -> Published', async () => {


    const response = await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(200);

    let articleId = response.body.articleId;


    await request(app).put('/articles/upload').send({
            articleId,
            readingTime: 27.99,
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            title: 'A Published Article',
            body: 'some body to you',
            date: Date.now(),
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            writerName: username,
            categories: ['travel', 'demo'],
            status: 'PUBLISHED',
            publicationId
        })
        .set('Authorization', encryptedAccessToken)
        .expect(200);


});


it('Responds 200 in case DRAFT article -> updated DRAFT', async () => {


    const response = await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(200);

    let articleId = response.body.articleId;



    await request(app).put('/articles/upload').send({
            articleId: articleId,
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(200);
});

it('Responds 400 when article is a new imported article and does not have origin (or bad origin) or articleId', async () => {


    // It doesn't have articleId & origin. 
    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT',
            newlyImported: true
        })
        .set('Authorization', encryptedAccessToken)
        .expect(400);



    // It doesn't have origin. 
    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT',
            newlyImported: true,
            articleId: 'any-article-id-would-work'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(400);


    // It doesn't have articleId. 
    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT',
            newlyImported: true,
            origin: 'substack'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(400);




    // Wrong origin. 
    await request(app).put('/articles/upload').send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT',
            newlyImported: true,
            origin: 'bad site'
        })
        .set('Authorization', encryptedAccessToken)
        .expect(400);


})

it('Creates an article in the backend when sent an imported article', async () => {

    await request(app).put('/articles/upload')
        .query({
            articleId: 'article id sent from backend while importing'
        })
        .send({
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            status: 'DRAFT',
            newlyImported: true,
            origin: 'substack',
        })
        .set('Authorization', encryptedAccessToken)
        .expect(200);

})