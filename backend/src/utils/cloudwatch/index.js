const config = require('../../../config');
var AWS = require('aws-sdk');
const logger = require('../logger/index');
const redis = require('../../db/redis/index')
// Set the region 


const Sentry = require('@sentry/node');

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: config.aws.accessId,
    secretAccessKey: config.aws.secretKey
});

// Create CloudWatch service object
var cw = new AWS.CloudWatchLogs();

// const logGroupAlarmP1 = config.cloudwatch.p1Alarm;
// const logStreamNameWithdrawApi = config.cloudwatch.streamWithdrawApi;

async function reportP1AlarmForWithdrawAPI(payoutId, markAsSuccess) {

    const type = markAsSuccess ? 'Mark as success' : 'Reverse transaction failed';


    try {

        var res = await cw.putLogEvents({
            "logEvents": [{
                "message": "ERROR Fatal: Caught for Withdraw API",
                "timestamp": Date.now()
            }, {
                "message": `payoutId:  ${payoutId} and type: ${type}`,
                "timestamp": Date.now()
            }],
            "logGroupName": logGroupAlarmP1,
            "logStreamName": logStreamNameWithdrawApi,
            'sequenceToken': config.cloudwatch.nextSequenceToken
        }).promise();


        const nextSeqToken = res.nextSequenceToken;
        console.log(nextSeqToken);
        config.cloudwatch.nextSequenceToken = nextSeqToken;

        try {
            await redis.utils.setCloudwatchNextToken(nextSeqToken);
        } catch (e) {
            console.log(e);
            Sentry.captureException(e);
        }


    } catch (e) {

        Sentry.captureException(e);
        logger.error(e);
    }
}


module.exports = {
    reportP1AlarmForWithdrawAPI
}