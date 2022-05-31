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
const {
    initBeforeEach
} = require('../init');

const email = 'test1@gmail.com';
const username = 'test-user';
const international = false;
const name = 'sam';
const phone = '9315859952'
const password = 'Default@123'

const reusableObj = {
    encryptedAccessToken: null,
    publicationId: null
}



describe("Get All Articles For Publication", () => {


    initBeforeEach(username, email, password, name, international, reusableObj);


    it('Responds 400 in case of wrong/bad parameters', async () => {


        await request(app).get('/articles/getArticlesForPublication').query({
                limit: 5,
                skip: 0
            })
            .set('Authorization', reusableObj.encryptedAccessToken)
            .expect(400);

        await request(app).get('/articles/getArticlesForPublication').query({
                limit: 5,
                publicationId: reusableObj.publicationId
            })
            .set('Authorization', reusableObj.encryptedAccessToken)
            .expect(400);

        await request(app).get('/articles/getArticlesForPublication').query({
                limit: 5,
                publicationId: reusableObj.publicationId
            })
            .set('Authorization', reusableObj.encryptedAccessToken)
            .expect(400);
    });


    it('Responds 200 in case correct request with articles', async () => {

        await request(app).get('/articles/getArticlesForPublication').query({
                limit: 5,
                skip: 0,
                publicationId: reusableObj.publicationId
            })
            .set('Authorization', reusableObj.encryptedAccessToken)
            .expect(200);

    });

})