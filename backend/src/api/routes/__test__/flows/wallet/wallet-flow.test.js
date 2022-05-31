const app = require('../../../../app')
const mongo = require('../../../../../db/mongo/index')
const request = require('supertest');
const logger = require('../../../../../utils/logger');

const fs = require('fs');
const path = require('path');

const {
    jwt,
    decryptForFrontend,
    encrypt
} = require('../../../../../utils/encryption');
const {
    WALLET_ATT_CUT_RATE
} = require('../../../../../../constants');

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
let publicationId, articleId;

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




    /*
     * This is used to create a publication with images. 
     * Which will in turn be used by the get API in the response.
     */

    const res = await request(app).post('/publication/').query({
            name: 'My First Publication'
        })
        .set('Authorization', encryptedAccessToken2).expect(201);

    publicationId = res.body.publicationId;

    const articleResponse = await request(app).put('/articles/upload').send({
            readingTime: 27.99,
            articlePic: 'https://ca.slack-edge.com/T02EPKQLLLT-U02MQL1AGM7-aac3d1842068-512',
            title: 'A Published Article',
            body: 'some body to you',
            date: Date.now(),
            writeup: "SOME JSON DATA THAT WILL BE SAVED IN S3",
            writerName: username2,
            categories: ['travel', 'demo'],
            status: 'PUBLISHED',
            publicationId
        })
        .set('Authorization', encryptedAccessToken2)
        .expect(200);

    articleId = articleResponse.body.articleId;
})


it('wallet flow while tipping writer', async () => {
    /**
     * 1. Send OTP to activate wallet
     * 2. Verify OTP & activate the wallet
     * 3. Transaction of tip 
     */

    await request(app).post('/wallet/sendOTP')
        .set('Authorization', encryptedAccessToken)
        .expect(200);


    const otp = (await mongo.email.getEmailDoc(email)).otp;
    const pin = 696969;
    await request(app).post('/wallet/activate')
        .set('Authorization', encryptedAccessToken)
        .send({
            otp,
            pin
        })
        .expect(200);

    /**
     * Add money to wallet of user from our side. 
     */
    const amt = 100;

    const orderRes = await request(app).post('/wallet/funds/order')
        .set('Authorization', encryptedAccessToken)
        .query({
            amount: amt
        })
        .expect(200);



    const {
        orderId,
        amount,
        credits
    } = orderRes.body;

    await mongo.transactionWalletAddUser.addMoneyToWallet(username, orderId);




    /**
     * Get wallet balance. 
     */


    var userInfo = await mongo.users.getUser(username, true);


    expect(userInfo.wallet.credits).toBe(amt);


    /**
     * This should fail because of wrong pin and give 401 error. 
     */
    await request(app).post('/wallet/tip/selection')
        .set('Authorization', encryptedAccessToken)
        .query({
            pin: 696961,
            articleId
        }).send({
            selection: 'Hello hello',
            amount: amt
        })
        .expect(401);

    /**
     * In case of insufficient balance it should fail
     */
    await request(app).post('/wallet/tip/selection')
        .set('Authorization', encryptedAccessToken)
        .query({
            pin,
            articleId
        }).send({
            selection: 'Hello hello',
            amount: amt + 1
        })
        .expect(400);





    await request(app).post('/wallet/tip/selection')
        .set('Authorization', encryptedAccessToken)
        .query({
            pin,
            articleId
        }).send({
            selection: 'Hello hello',
            amount: amt
        })
        .expect(200);



    const attTax = WALLET_ATT_CUT_RATE;
    const earnings = amt - attTax * amt;
    var userInfo2 = await mongo.users.getUser(username2, true);

    expect(userInfo2.wallet.earnings).toBe(earnings);


});