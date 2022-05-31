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



const email2 = 'test12@gmail.com';
const username2 = 'test-user2';
const name2 = 'sa2m';
const phone2 = '9315835992'
const password2 = 'Default@123'

let encryptedAccessToken;
let encryptedAccessToken2;

/*
    Creates 2 users before each step. 
*/

beforeEach(async () => {
    /* This is a way to create a user and add a phone number and email to the user. */
    let id = await mongo.security.createUserAddPhone(phone);
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


    /* Creating another user*/
    let id2 = await mongo.security.createUserAddPhone(phone2);
    await mongo.security.createUserAddEmail(id2, email2);
    await request(app).post('/onboarding/createUser').send({
        username: username2,
        email: email2,
        password: password2,
        phone: phone2,
        name: name2,
        international,
        id: id2
    }).expect(201);
    /* This is a way to get the access token for the user. */

    let accessToken2 = jwt.sign(username2);
    accessToken2 = await decryptForFrontend(accessToken2);
    encryptedAccessToken2 = encrypt(accessToken2);

})


/*
Bad parameter check for the following APIs
1. Unfollow API
2. Follow API
3. Get Followers API
4. Get Following API
*/

it('Bad Requests for Follow/Unfollow User Flow ', async () => {


    await request(app).post('/users/follow').query({})
        .set('Authorization', encryptedAccessToken).expect(400);



    await request(app).get('/users/followers').query({})
        .set('Authorization', encryptedAccessToken).expect(400);



    await request(app).get('/users/following').query({})
        .set('Authorization', encryptedAccessToken).expect(400);


    await request(app).delete('/users/unfollow').query({})
        .set('Authorization', encryptedAccessToken).expect(400);

});






/*
This flow is tested: 
1. UserA follows UserB
2. Get Followers of UserB includes UserA
3. Get Following of UserA includes UserB
4. UserA un-follows UserB
5. Get Followers of UserB is empty array
6. Get Following of UserA is empty array
*/

it('Follow/Unfollow User Flow', async () => {

    /*
     * This test makes username1 follow username2
     */

    await request(app).post('/users/follow').query({
            follows: username2
        })
        .set('Authorization', encryptedAccessToken).expect(201);


    /*
     * This test makes sure that username2's followers have username1
     */

    var followersOfUserB = await request(app).get('/users/followers').query({
            username: username2
        })
        .set('Authorization', encryptedAccessToken).expect(200);


    let followers = followersOfUserB.body.followers;
    expect(followers.includes(username)).toBe(true)


    /*
     * This test makes sure that username1's following has username2
     */

    var followingOfA = await request(app).get('/users/following').query({
            username: username
        })
        .set('Authorization', encryptedAccessToken).expect(200);

    let following = followingOfA.body.following;
    expect(following.includes(username2)).toBe(true)

    /*
     * This test makes sure that username2's followers does not have username1
     * As username1 has un-followed username2
     */

    await request(app).delete('/users/unfollow').query({
            follows: username2
        })
        .set('Authorization', encryptedAccessToken).expect(201);



    followersOfUserB = await request(app).get('/users/followers').query({
            username: username2
        })
        .set('Authorization', encryptedAccessToken).expect(200);


    followers = followersOfUserB.body.followers;
    expect(!followers.includes(username)).toBe(true)


    /*
     * This test makes sure that username1's following does not have username2
     * As he has un-followed username 2 
     */

    followingOfA = await request(app).get('/users/following').query({
            username: username
        })
        .set('Authorization', encryptedAccessToken).expect(200);



    following = followingOfA.body.following;
    expect(!following.includes(username2)).toBe(true)

    /*
    Successful if all of this passes
    */

});