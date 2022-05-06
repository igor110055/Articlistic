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


it('Responds 201 and gives appropriate response', async () => {
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
     *First test is for one without picture and a returns a publication id.
     *Second one is with a picture returns a publication id and publication pic link. 
     */

    const idResponse = await request(app).post('/publication/').query({
        name: 'My First Publication'
    }).set('Authorization', encryptedAccessToken).expect(201)

    expect(idResponse.body.publicationId).toBeDefined();

    const pictureResponse = await request(app).post('/publication/').query({
            name: 'My First Publication'
        }).attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(201);

    expect(pictureResponse.body.publicationId).toBeDefined();
    expect(pictureResponse.body.publicationPic).toBeDefined();
})

it('Responds 400 in case name (required parameter) is missing', async () => {
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

    await request(app).post('/publication/').query({}).set('Authorization', encryptedAccessToken).expect(400)
})