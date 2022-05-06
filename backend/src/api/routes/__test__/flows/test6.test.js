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
let articleId;


/*
    Creates articleId, publicationId and user before each step. 
*/

beforeEach(async () => {
    /* This is a way to create a user and add a phone number and email to the user. */
    id = await mongo.security.createUserAddPhone(phone);
    await mongo.security.createUserAddEmail(email);
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        password,
        phone,
        name,
        international,
        id
    }).expect(201);
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

    const articleResponse = await request(app).put('/articles/upload').send({
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

    articleId = articleResponse.body.articleId;
})


/*

Testing the selections flow. 
1. Mark selection meaningful. 
2. Get All Selections for article. 
3. Find Selection which is similar to point 1. 
4. Remove selection. 
5. Get All Selections for article. 

*/

test('Selections flow is being tested here', async () => {


    const selection = 'A selection in the article';

    await request(app).post('/articles/selection/meaningful').query({
            articleId,
            selection
        })
        .set('Authorization', encryptedAccessToken).expect(200);


    const res = await request(app).get('/articles/selection/all').query({
            articleId
        })
        .set('Authorization', encryptedAccessToken).expect(200);


    var selectionResponse = res.body.selections[0];

    expect(selectionResponse.meaningful.includes(username)).toBe(true);
    expect(selectionResponse.selection).toBe(selection);
    expect(selectionResponse.meaningfulCount).toBe(1);


    await request(app).post('/articles/selection/unmeaningful').query({
            articleId,
            selection
        })
        .set('Authorization', encryptedAccessToken).expect(200);

    const res3 = await request(app).get('/articles/selection/all').query({
            articleId
        })
        .set('Authorization', encryptedAccessToken).expect(200);


    selectionResponse = res3.body.selections[0];
    expect(selectionResponse.meaningful.includes(username)).toBe(false);
    expect(selectionResponse.selection).toBe(selection);
    expect(selectionResponse.meaningfulCount).toBe(0);

})