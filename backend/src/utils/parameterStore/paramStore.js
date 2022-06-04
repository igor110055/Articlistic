const AWS = require('aws-sdk');
const logger = require("../logger/index");
var config = require("../../../config");
var result = {};
var ssmClient;

// var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
// AWS.config.credentials = credentials;



async function parseArray(arrayOfEnvVariable) {
    try {
        for (let i of arrayOfEnvVariable) {
            result[i] = await getFromParamStore(i);
        }
        await setConfig(result);
    }
    catch (e) {
        logger.error(`error`, e);
    }
}

async function mapValues(z) {
    Object.keys(z).forEach((key) => {   //key--> main service
        var subService = z[key];    //storing sub-object
        config[key] = subService;   //setting sub-object as value in main service
        Object.keys(subService).forEach((subkey) => {  //loop through sub-object
            //subkey ---> sub-service
            const value = subService[subkey];   // value of each sub-service
            config[key][subkey] = value;
        });

    })
}


async function setConfig(result) {
    try {
        var config_var = {
            environment: process.env["NODE_ENV"],
            hosting: {
                host: result["DEV_host"],
                port: parseInt[result["DEV_po"]] || 3000
            },
            mongo: {
                uri: result["DEV_MONGO_DB_URI"],
                db: result["DEV_MONGO_DB_NAME"],
            },
            utils: {
                encryptionSalt: result["DEV_SALT_ENC"],
            },

            jwt: {
                tokenSecret: result["TOKEN_SECRET"],
            },
            sendgrid: {
                key: result["SENDGRID_KEY"],
            },
            aws: {
                accessId: result["ATT_AWS_ACCESS_ID"],
                secretKey: result["ATT_AWS_SECRET_KEY"],
                s3BucketArticles: result["ATT_AWS_S3_BUCKET_ARTICLES"],
                s3BucketProfile: result["ATT_AWS_S3_BUCKET_PROFILE"],
                region: result["ATT_AWS_REGION"],
                urlForArticles: result["URL_FOR_ARTICLES"],
                urlForProfile: result["URL_FOR_PROFILE"],
            },
            redis: {
                uri: result["REDIS_URI"],
            },
            tf: {
                apiKey: result["TF_API_KEY"],
            },
            sentry: {
                uri: result["SENTRY_URI"],
            },
            rp: {
                keyId: result["RP_KEY_ID"],
                secret: result["RP_SECRET_KEY"],
            },
            google: {
                clientId: result["GOOGLE_CLIENT_ID"],
            },
            dollar: {
                accessCode: result["EXCHANGE_API_RATE_ACCESS_CODE"],
            },
            ip: {
                apiKey: result["IP_API_KEY"],
            }
        }
        await mapValues(config_var);
    } catch (e) {
        logger.error(e);
    }
}


const getFromParamStore = async (envArrayElem) => {
    if (!ssmClient)
        ssmClient = new AWS.SSM({
            region: "ap-south-1",
            apiVersion: "latest"
        });

    try {
        let decryptedParameter = await ssmClient.getParameter({
            Name: envArrayElem,
            WithDecryption: true,
        }).promise();

        return (decryptedParameter.Parameter.Value);
    }
    catch (e) {
        logger.info(e, "error")
    }
}


module.exports = { parseArray };