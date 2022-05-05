var AWS = require('aws-sdk');
const logger = require('../../logger/index');
var config = require('../../../../config');


async function sendMessage(phoneNumber, subject, message) {

    let params = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': subject
            },
            'AWS.SNS.SMS.SMSType': {
                'DataType': 'String',
                'StringValue': "Transactional"
            }
        }

    };



    AWS.config.update({
        "accessKeyId": config.aws.accessId,
        "secretAccessKey": config.aws.secretKey,
        "region": 'us-east-1'
    });


    // AWS.config.region = ;
    let sns = new AWS.SNS();
    await sns.publish(params).promise();

    // let res = await publishTextPromise();
    return res;
}

async function sendOTP(phoneNumber) {

    logger.debug("Sending to " + phoneNumber.toString());
    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#createSMSSandboxPhoneNumber-property
    var params = {
        PhoneNumber: phoneNumber,
        /* required */
        LanguageCode: 'en-US'
    };

    // AWS.config.region = 'us-east-1'


    AWS.config.update({
        "accessKeyId": config.aws.accessId,
        "secretAccessKey": config.aws.secretKey,
        "region": config.aws.region
    });

    let sns = new AWS.SNS({
        apiVersion: '2010-03-31'
    });

    let res;
    try {
        res = await sns.createSMSSandboxPhoneNumber(params).promise();
    } catch (e) {
        logger.error(e);
        throw e;
    }

    return res;


}

async function verifyOTP(otp, phoneNumber) {

    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#verifySMSSandboxPhoneNumber-property
    var params = {
        OneTimePassword: otp,
        /* required */
        PhoneNumber: phoneNumber /* required */
    };
    AWS.config.region = config.aws.region

    let sns = new AWS.SNS();

    let res;
    try {

        res = await sns.verifySMSSandboxPhoneNumber(params).promise();
        return res;

    } catch (e) {
        logger.error(e);
        throw e;
    }


}


module.exports = {
    sendMessage,
    sendOTP,
    verifyOTP
}