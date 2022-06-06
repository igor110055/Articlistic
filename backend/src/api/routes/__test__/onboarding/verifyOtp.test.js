const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');
const e = require('cors');

const email = 'test1@gmail.com';
const otp = "292940";

describe("Missing Parameter test", () => {
    test('Returns 400 if email is missing', async () => {
        await request(app).post("/onboarding/email/verifyOTP").query({
            otp
        }).expect(400);
    })
    test('Returns 400 if otp is missing', async () => {
        await request(app).post("/onboarding/email/verifyOTP").query({
            email
        }).expect(400);
    })
})

describe("OTP Validation", () => {
    // beforeEach(async()=>{
    //     await request(app).post("/onboarding/email/sendOTP").query({
    //         email
    //     })
    // })

    test("Return 200 if OTP is Valid", async () => {
        await mongo.email.createOTP(email, otp);
        request(app).post("/onboarding/email/verifyOTP").query({
            email,
            otp
        }).expect(200)
    })

    test("Return 400 if OTP is invalid", async () => {
        await mongo.email.createOTP(email, otp);
        request(app).post("/onboarding/email/verifyOTP").query({
            email,
            otp: "123345"
        }).expect(400)
    })
})