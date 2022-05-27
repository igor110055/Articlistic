const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');

const email = 'test1@gmail.com';
const username = 'test-user';
const password = 'Default@123'


test('Session ID as required parameter in case user is from the US/India', async () => {

    const indianRes = await request(app).post('/onboarding/email/sendOTP').send({
        email: email
    })
    .expect(200);
    
})
