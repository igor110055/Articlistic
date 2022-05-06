/*

Send OTP & Verify OTP Flow. 
1. Send OTP - Email - Create User. 
2. Verify OTP - Email - Create User.


3. Send OTP - Email - Utils. 
4. Verify OTP - Email - Utils.


5. Send OTP - Phone - Create User. 
6. Verify OTP - Phone - Create User.


7. Send OTP - Phone - Utils. 
8. Verify OTP - Phone - Utils.


*/
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
const intPhone = '+619315859952'


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



test('Bad Parameters - Verify/Send OTP', async () => {




    /*
    Send OTP bad parameters check + checking an existing phone number

    */

    await request(app).post('/onboarding/phone/sendOTP').send({
            phone: '9315859952',
            international
        })
        .expect(409);





    await request(app).post('/onboarding/phone/sendOTP').send({
            international,
        })
        .expect(400);


    // await request(app).post('/onboarding/phone/verifyOTP').send({
    //         phone: '+319315859952',
    //         international: true
    //     })
    //     .expect(400);


})

test('Verify/Send OTP Phone - Onboarding', async () => {



    /*
    Sending and verifying an international number. 
    */

    const intRes1 = await request(app).post('/onboarding/phone/sendOTP').send({
            phone: '+319315859952',
            international: true,
        })
        .expect(200);

    expect(intRes1.body.sessionId).toBeUndefined()

    const intRes2 = await request(app).post('/onboarding/phone/verifyOTP').send({
            phone: '+319315859952',
            international: true,
            code: 123456

        })
        .expect(200);


    expect(intRes2.body.id).toBeDefined();

    /*

    Sending and verifying indian numbers
    
    */

    const localRes1 = await request(app).post('/onboarding/phone/sendOTP').send({
            phone: '9315859951',
            international: false
        })
        .expect(200);


    expect(localRes1.body.sessionId).toBeDefined();


    const response = await request(app).post('/onboarding/phone/verifyOTP').send({
            phone: '9315859951',
            sessionId: 'attentioun',
            international: false,
            code: 123456
        })
        .expect(200);

    expect(response.body.id).toBeDefined();



})




test('Verify/Send OTP Phone - Utils', async () => {


    /*
    Sending and verifying an international number. 
    */

    const intRes1 = await request(app).post('/utils/phone/sendOTP').send({
            phone: intPhone,
            international: true,
        })
        .expect(200);

    expect(intRes1.body.sessionId).toBeUndefined()

    const intRes2 = await request(app).post('/utils/phone/verifyOTP').send({
            phone: intPhone,
            international: true,
            code: 123456

        })
        .expect(200);


    expect(intRes2.body.id).toBeDefined();

    /*

    Sending and verifying indian numbers
    
    */

    const localRes1 = await request(app).post('/utils/phone/sendOTP').send({
            phone: phone,
            international: false
        })
        .expect(200);


    expect(localRes1.body.sessionId).toBeDefined();


    const response = await request(app).post('/utils/phone/verifyOTP').send({
            phone: phone,
            sessionId: 'attentioun',
            international: false,
            code: 123456
        })
        .expect(200);

    expect(response.body.id).toBeDefined();



})