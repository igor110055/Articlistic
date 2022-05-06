const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');


const email = 'test1@gmail.com';
const username = 'test-user';
const international = false;
const name = 'sam';
const phone = '9315859952'
const password = 'Default@123'

const intEmail = 'int@gmail.com';
const intUsername = 'int-test-user';
const intPhone = '+19315859952'


let id;


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



    id = await mongo.security.createUserAddPhone(intPhone);
    await mongo.security.createUserAddEmail(id, intEmail);
    await request(app).post('/onboarding/createUser').send({
        username: intUsername,
        email: intEmail,
        password,
        phone: intPhone,
        name,
        international: true,
        id
    }).expect(201);
    /* This is a way to get the access token for the user. */

})




test('Returns session Id on international (American) & national users', async () => {

    /*
         International response for American users should have sessionId in response. 

     */

    const intRes1 = await request(app).post('/utils/phone/sendOTP').send({
            phone: '9315859952',
            international: false,
        })
        .expect(200);

    expect(intRes1.body.sessionId).toBeDefined();

    /*
    	Indian Users  should have sessionId in response. 

    */

    const indianRes = await request(app).post('/utils/phone/sendOTP').send({
            phone: intPhone,
            international: true,
        })
        .expect(200);

    expect(indianRes.body.sessionId).toBeDefined();

})