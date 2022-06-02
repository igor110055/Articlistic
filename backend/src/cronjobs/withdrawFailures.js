const mongo = require('../db/mongo/index')
const Sentry = require('@sentry/node');
const s3 = require('../utils/s3');



async function withdrawDatabaseFailureReverse() {
    /**
     * Algorithm: 
     * 1. Get all the files from s3. 
     * 2. Extract a list of Objects from these files. 
     * 3. - Iterate over the last list - do the query of reversing a payout. 
     *    - If it succeeds add into an array of successful reversals. 
     *    - Log something if the file fails. 
     * 5. Delete all the files which have succeeded. 
     */




    const listOfFailedPayouts = [{
        payoutId: 1,
        username: 'yash-dxt',
        amount: 500,
        fileName: 'yash.json'
    }]

    const payoutSuccessfulFiles = ["file1.json"];

    while (listOfFailedPayouts.length) {
        const currFailedPayout = listOfFailedPayouts.pop();

        const {
            amount,
            username,
            payoutId,
            fileName
        } = currFailedPayout;


        try {
            await mongo.transactionUserPayout.reversePayout(amount, username, payoutId);
        } catch (e) {
            Sentry.captureMessage(`Reverse payout failed in cronjob for payoutId: ` + payoutId);
            Sentry.captureException(e);
            continue;
        }

        payoutSuccessfulFiles.push(fileName);

    }

    try {
        await s3.init().deleteMultipleFilesFromErrorData(payoutSuccessfulFiles);
    } catch (e) {
        Sentry.captureException(e);
    }



}

async function withdrawDatabaseFailureMarkSuccess() {
    /**
     * Algorithm: 
     * 1. Get all the files from s3. 
     * 2. Extract a list of strings from these files. 
     * 3. - Iterate over the last list - do the query of marking as successful. 
     *    - If it succeeds add into an array of successful mark of success. 
     *    - Log something if the file fails. 
     * 5. Delete all the files which have succeeded. 
     */





    const listOfUnmarkedPayouts = [{
        payoutId: "abc",
        fileName: 'abcd'
    }]

    const payoutSuccessfulFiles = ["file1.json"];

    while (listOfUnmarkedPayouts.length) {
        const {
            payoutId,
            fileName
        } = listOfUnmarkedPayouts.pop();

        try {
            await mongo.payouts.payoutSuccess(payoutId);
        } catch (e) {
            Sentry.captureMessage(`Payout success marked failed in cronjob for payoutId: ` + payoutId);
            Sentry.captureException(e);
            continue;
        }

        payoutSuccessfulFiles.push(fileName);

    }

    try {
        await s3.init().deleteMultipleFilesFromErrorData(payoutSuccessfulFiles);
    } catch (e) {
        Sentry.captureException(e);
    }




}


module.exports = {
    withdrawDatabaseFailureMarkSuccess,
    withdrawDatabaseFailureReverse
}