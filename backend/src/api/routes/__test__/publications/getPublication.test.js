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




it('Responds 200 in case right query with appropriate response', async () => {
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
    });
    /* This is a way to get the access token for the user. */

    let accessToken = jwt.sign(username);
    accessToken = await decryptForFrontend(accessToken);
    let encryptedAccessToken = encrypt(accessToken);


    /*
     * This is used to create a publication with images. 
     * Which will in turn be used by the get API in the response.
     */

    let response = await request(app).post('/publication/').query({
            name: 'My First Publication'
        }).attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(201);


    const publicationId = response.body.publicationId;
    /*
     * Here starts the original test for GET Publication. 
     */



    const getResponse = await request(app).get('/publication/').query({
        publicationId
    }).set('Authorization', encryptedAccessToken);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.publicationId).toBe(publicationId);
    expect(getResponse.body.publicationPic).toBeDefined();
    expect(getResponse.body.publicationName).toBe('My First Publication');





});

it('Responds 400 in case of missing publication ID', async () => {
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
    });
    /* This is a way to get the access token for the user. */

    let accessToken = jwt.sign(username);
    accessToken = await decryptForFrontend(accessToken);
    let encryptedAccessToken = encrypt(accessToken);


    /*
     * This is used to create a publication with images. 
     * Which will in turn be used by the get API in the response.
     */

    let response = await request(app).post('/publication/').query({
            name: 'My First Publication'
        }).attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(201);


    /*
     * Here starts the original test for GET Publication. 
     */



    await request(app).get('/publication/').query({}).set('Authorization', encryptedAccessToken).expect(400);
});

it('Responds 404 in case publication does not exist', async () => {

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
    });
    /* This is a way to get the access token for the user. */

    let accessToken = jwt.sign(username);
    accessToken = await decryptForFrontend(accessToken);
    let encryptedAccessToken = encrypt(accessToken);


    /*
     * This is used to create a publication with images. 
     * Which will in turn be used by the get API in the response.
     */

    let response = await request(app).post('/publication/').query({
            name: 'My First Publication'
        }).attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(201);


    /*
     * Here starts the original test for GET Publication. 
     */



    await request(app).get('/publication/').query({
        publicationId: 'some-non-existent-publicationId'
    }).set('Authorization', encryptedAccessToken).expect(404);


});