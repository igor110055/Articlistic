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


it('Responds 200 in case successful fetch', async () => {


    /*
     * Uploading an article so that it could be fetched. 
     */

    await request(app).put('/publication/article').send({
        publicationId,
        writeup: "{'message': 'data from editor JS comes here in JSON format'}",
        intro: 'Intro that shows up for articles'
    }).set('Authorization', encryptedAccessToken).expect(200);

    /*
     * Here starts the original test for GET Publication Article. 
     */
    const response = await request(app).get('/publication/article').query({
        publicationId
    }).set('Authorization', encryptedAccessToken).expect(200);

    expect(response.body.content).toBeDefined();

});



it('Responds 400 in case missing parameters', async () => {


    /*
     * Uploading an article so that it could be fetched. 
     */

    await request(app).put('/publication/article').send({
        publicationId,
        writeup: "{'message': 'data from editor JS comes here in JSON format'}",
        intro: 'Intro that shows up for articles'
    }).set('Authorization', encryptedAccessToken).expect(200);

    /*
     * Here starts the original test for GET Publication Article. 
     */
    await request(app).get('/publication/article').query({}).set('Authorization', encryptedAccessToken).expect(400);

});


it('Responds 404 in case article is not there', async () => {

    /*
     * Here starts the original test for GET Publication Article. 
     */
    await request(app).get('/publication/article').query({
        publicationId
    }).set('Authorization', encryptedAccessToken).expect(404);

});