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



})


/*

1. Get Profile API
2. Edit Profile API

*/

it('Bad Params -> Checking the profile flow - Get & Edit Profile', async () => {

    await request(app).get('/users/profile').query({}).expect(400);

    await request(app).put('/users/profile').query({})
        .set('Authorization', encryptedAccessToken).expect(400);

    await request(app).get('/users/name').query({}).expect(400)

});

/*
This API tests the Get Profile Flow -
1. Get Profile. 
    Check name, check publication. 
2. Edit Profile & Change publication name. 
3. Get profile to check publication 
    Check changed name in publication & profile.
*/

it('Checking the profile flow - Get & Edit Profile', async () => {


    const res = await request(app).get('/users/profile').query({
        username: username
    }).expect(200);

    expect(res.body.writerSection.publications[0].publicationName).toBe('My First Publication');
    expect(res.body.name).toBe(name);
    expect(res.body.username).toBe(username);


    const updateRes = await request(app).put('/users/profile').query({
            place: 'Berlin',
            name: 'Dwight'
        })
        .attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(200);

    expect(updateRes.body.place).toBeDefined();
    expect(updateRes.body.name).toBeDefined();
    expect(updateRes.body.profilePic).toBeDefined();

    const getNameResponse = await request(app).get('/users/name').query({
        username
    }).expect(200)

    expect(getNameResponse.body.name).toBe('Dwight');


    const finalResponse = await request(app).get('/users/profile').query({
        username: username
    }).expect(200);

    expect(finalResponse.body.name).toBe('Dwight');
    expect(finalResponse.body.username).toBe(username);




});