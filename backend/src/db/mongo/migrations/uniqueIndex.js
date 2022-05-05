const mongo = require('../index');

/*

For Release Alpha v0.1
Loading Indexes on Production Date: 4-02-2021

*/

if (Date.now() < 1644062972000) {

    mongo.users.createUniquenessIndex();
    mongo.email.createTTLIndex();
    mongo.writers.createUniquenessIndex();
    mongo.publications.createUniquenessIndex();
    mongo.publications.createUniquenessIndex2();
    mongo.categories.createUniquenessIndex();
    mongo.analytics.createUniquenessIndex();
    mongo.articles.createUniquenessIndex();

}