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



it('Responds 400 in case of wrong/bad parameters', async () => {


    await request(app).get('/articles/get').query({})
        .set('Authorization', encryptedAccessToken).expect(400);

});



it('Responds 404 in case article does not exist', async () => {

    await request(app).get('/articles/get').query({
            articleId: 'random-articleId'
        })
        .set('Authorization', encryptedAccessToken).expect(404);



});


it('Responds 200 in case article is fetched successfully', async () => {


    const res = await request(app).put('/articles/upload').send({
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


    const articleId = res.body.articleId;


    await request(app).get('/articles/get').query({
            articleId
        })
        .set('Authorization', encryptedAccessToken).expect(200);

});