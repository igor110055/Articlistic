const mongo = require('../index');
const mongoCronJobs = require('../cronjob/index');
/*

For Release Alpha v0.1.0
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


/**
 * For Alpha v0.2.0
 */

/*
if (Date.now() < 1647440329000) {
    mongoCronJobs.articles.createDeletedAtIndex();
    mongoCronJobs.publications.createDeletedAtIndex();
}
*/