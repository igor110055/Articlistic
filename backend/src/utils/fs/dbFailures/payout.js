const fs = require('fs');
const fsPromises = fs.promises;

const reversePayoutDir = '/etc/ec2-user/payoutFailures/reversePayout/';
const markSuccessDir = '/etc/ec2-user/payoutFailures/markSuccess/';

const Sentry = require('@sentry/node');


async function dbFailReversePayout(payoutId, amount, username) {
    const fileName = reversePayoutDir + payoutId + '.json';

    const data = JSON.stringify({
        payoutId,
        amount,
        username
    });

    try {
        await fsPromises.writeFile(fileName, data);
    } catch (e) {
        Sentry.captureMessage(data);
    }
}

async function dbFailMarkPayoutSuccess(payoutId) {
    const fileName = markSuccessDir + payoutId + '.txt';

    const data = payoutId;

    try {
        await fsPromises.writeFile(fileName, data);
    } catch (e) {
        Sentry.captureMessage(data);
    }
}

module.exports = {
    dbFailMarkPayoutSuccess,
    dbFailReversePayout
}