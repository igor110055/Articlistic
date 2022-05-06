/*
Testing the APIs - 
1. Create Bookmark
2. Remove Bookmark
3. Get Bookmarks
*/


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

Bad parameter check for the following APIs
1. Bookmark an article
2. Remove Bookmark

*/




it('Bad Parameters check - bookmark APIs', async () => {


    /*
    Adding a bookmark for a user
    */
    await request(app).post('/users/bookmark').query({})
        .set('Authorization', encryptedAccessToken).expect(400);


    /*
        Removing the bookmark for the user. 
    */


    await request(app).delete('/users/bookmark').query({})
        .set('Authorization', encryptedAccessToken).expect(400);

})


/*

The flow being tested is as follows ->
1. Bookmark an article
2. Get Bookmarks API to check if article exists
3. Remove Bookmark
4. Get Bookmark API to check if the bookmark has been removed. 

*/

it('Checks the bookmark APIs', async () => {


    /*
    Adding a bookmark for a user
    */
    await request(app).post('/users/bookmark').query({
            articleId
        })
        .set('Authorization', encryptedAccessToken).expect(201);


    /*
    Checking if the bookmark is added to the user successfully. 
    */

    var response =
        await request(app).get('/users/bookmarks')
        .set('Authorization', encryptedAccessToken).expect(200);


    let bookmarks = response.body.bookmarks;
    expect(bookmarks.find((x) => x.articleId === articleId)).toBeDefined();

    /*
        Removing the bookmark for the user. 
        */


    await request(app).delete('/users/bookmark').query({
            articleId
        })
        .set('Authorization', encryptedAccessToken).expect(201);


    /*
    Confirming that the bookmark has been removed successfully. 
    */
    response =
        await request(app).get('/users/bookmarks')
        .set('Authorization', encryptedAccessToken).expect(200);

    bookmarks = response.body.bookmarks;
    expect(bookmarks.find((x) => x.articleId === articleId)).toBeUndefined();



})