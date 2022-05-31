const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');


const email = 'test1@gmail.com';
const username = 'test-user';
const international = false;
const name = 'sam';
const phone = '9315859952'
const password = 'Default@123'


test('Returns session Id on international (American) & national users', async () => {

    /*
         International response for American users should have sessionId in response. 

     */

    const intRes1 = await request(app).post('/onboarding/phone/sendOTP').send({
            phone: '9315859951',
            international: false,
        })
        .expect(200);

    expect(intRes1.body.sessionId).toBeDefined();

    /*
    	Indian Users  should have sessionId in response. 

    */

    const indianRes = await request(app).post('/onboarding/phone/sendOTP').send({
            phone: '+15742137586',
            international: true,
        })
        .expect(200);

    expect(indianRes.body.sessionId).toBeDefined();

})



test('Does not receive sessionId in case international and not from USA', async () => {



    /*

        International users from outside America should not receive sessionId. 

        */

    const intRes1 = await request(app).post('/onboarding/phone/sendOTP').send({
            phone: '+319315859952',
            international: true,
        })
        .expect(200);

    expect(intRes1.body.sessionId).toBeUndefined();

})


test('Session ID as required parameter in case user is from the US/India', async () => {

    /*
         International response for American users should have sessionId in body. 

     */

    const intRes1 = await request(app).post('/onboarding/phone/verifyOTP').send({
            phone: '9315859951',
            international: false,
        })
        .expect(400);


    /*
    	Indian Users  should have sessionId in body. 

    */

    const indianRes = await request(app).post('/onboarding/phone/verifyOTP').send({
            phone: '+15742137586',
            international: true,
        })
        .expect(400);


})



test('Verification of OTP in case correct parameters', async () => {

    /*
    International response for American users should have sessionId in body and hence receives correct response 
     */

    await request(app).post('/onboarding/phone/verifyOTP').send({
            phone: '9315859951',
            international: false,
            code: 123456,
            sessionId: 'temp'
        })
        .expect(200);


    /*
    	Indian Users should have sessionId in body and hence receives correct response. 
    */


    await request(app).post('/onboarding/phone/verifyOTP').send({
            phone: '+15742137586',
            international: true,
            code: 123456,

            sessionId: 'temp'
        })
        .expect(200);



    /*
    International users don't require sessionId
    */


    await request(app).post('/onboarding/phone/verifyOTP').send({
            phone: '+31291808923',
            international: true,
            code: 123456,

        })
        .expect(200);



})