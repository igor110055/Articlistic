require('dotenv').config();

var environVarArray = ['SENTRY_URI', 'ATT_AWS_ACCESS_ID', 'ATT_AWS_REGION', 'ATT_AWS_S3_BUCKET_ARTICLES',
    'ATT_AWS_S3_BUCKET_PROFILE', 'ATT_AWS_SECRET_KEY', 'DEV_MONGO_DB_NAME',
    'DEV_MONGO_DB_URI', 'DEV_SALT_ENC', 'DEV_host', 'DEV_port', 'EXCHANGE_API_RATE_ACCESS_CODE',
    'GOOGLE_CLIENT_ID', 'IP_API_KEY', 'REACT_APP_ENCRYPTION_SALT',
    'REACT_APP_SERVER_LINK', 'REDIS_URI', 'RP_KEY_ID', 'RP_SECRET_KEY',
    'SENDGRID_KEY', 'TF_API_KEY', 'TOKEN_SECRET', 'URL_FOR_ARTICLES', 'URL_FOR_PROFILE'
]

const env = process.env.NODE_ENV;



const devEnvVariables = {}

const dev = {
    environment: process.env.NODE_ENV,
    hosting: {
        host: process.env.DEV_host,
        port: parseInt(process.env.DEV_port) || 3000
    },
    mongo: {
        uri: process.env.DEV_MONGO_DB_URI,
        db: process.env.DEV_MONGO_DB_NAME
    },
    utils: {
        encryptionSalt: process.env.DEV_SALT_ENC
    },
    jwt: {
        tokenSecret: process.env.TOKEN_SECRET
    },
    sendgrid: {
        key: process.env.SENDGRID_KEY
    },
    aws: {
        accessId: process.env.AWS_ACCESS_ID,
        secretKey: process.env.AWS_SECRET_KEY,
        s3BucketArticles: process.env.AWS_S3_BUCKET_ARTICLES,
        s3BucketProfile: process.env.AWS_S3_BUCKET_PROFILE,
        region: process.env.AWS_REGION,
        urlForArticles: process.env.URL_FOR_ARTICLES,
        urlForProfile: process.env.URL_FOR_PROFILE
    },
    redis: {
        uri: process.env.REDIS_URI
    },
    tf: {
        apiKey: process.env.TF_API_KEY
    },
    sentry: {
        uri: process.env.SENTRY_URI
    },
    rp: {
        keyId: process.env.RP_KEY_ID,
        secret: process.env.RP_SECRET_KEY
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    },
    dollar: {
        accessCode: process.env.EXCHANGE_API_RATE_ACCESS_CODE,
        avApiKey: process.env.ALPHAVANTAGE_API_KEY
    },
    ip: {
        apiKey: process.env.IP_API_KEY
    }
}

const local = {
    environment: process.env.NODE_ENV,
    hosting: {
        host: process.env.DEV_host,
        port: parseInt(process.env.DEV_port) || 3000
    },
    mongo: {
        uri: process.env.DEV_MONGO_DB_URI,
        db: process.env.DEV_MONGO_DB_NAME
    },
    utils: {
        encryptionSalt: process.env.DEV_SALT_ENC
    },
    jwt: {
        tokenSecret: process.env.TOKEN_SECRET
    },
    sendgrid: {
        key: process.env.SENDGRID_KEY
    },
    aws: {
        accessId: process.env.AWS_ACCESS_ID,
        secretKey: process.env.AWS_SECRET_KEY,
        s3BucketArticles: process.env.AWS_S3_BUCKET_ARTICLES,
        s3BucketProfile: process.env.AWS_S3_BUCKET_PROFILE,
        region: process.env.AWS_REGION,
        urlForArticles: process.env.URL_FOR_ARTICLES,
        urlForProfile: process.env.URL_FOR_PROFILE,
        s3BucketErrors: process.env.AWS_S3_BUCKET_ERRORS
    },
    redis: {
        uri: process.env.REDIS_URI
    },
    tf: {
        apiKey: process.env.TF_API_KEY
    },
    sentry: {
        uri: process.env.SENTRY_URI
    },
    rp: {
        keyId: process.env.RP_KEY_ID,
        secret: process.env.RP_SECRET_KEY
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    },
    dollar: {
        accessCode: process.env.EXCHANGE_API_RATE_ACCESS_CODE,
        avApiKey: process.env.ALPHAVANTAGE_API_KEY
    },
    ip: {
        apiKey: process.env.IP_API_KEY
    }
}



const prod = {
    environment: process.env.NODE_ENV,
    hosting: {
        host: process.env.PROD_host,
        port: parseInt(process.env.PROD_port) || 3000
    },
    mongo: {
        uri: process.env.PROD_MONGO_DB_URI,
        db: process.env.PROD_MONGO_DB_NAME
    },
    utils: {
        encryptionSalt: process.env.PROD_SALT_ENC
    },
    jwt: {
        tokenSecret: process.env.TOKEN_SECRET
    },
    sendgrid: {
        key: process.env.SENDGRID_KEY
    },
    aws: {
        accessId: process.env.AWS_ACCESS_ID,
        secretKey: process.env.AWS_SECRET_KEY,
        s3BucketArticles: process.env.AWS_S3_BUCKET_ARTICLES,
        s3BucketProfile: process.env.AWS_S3_BUCKET_PROFILE,
        region: process.env.AWS_REGION,
        urlForArticles: process.env.URL_FOR_ARTICLES,
        urlForProfile: process.env.URL_FOR_PROFILE
    },
    redis: {
        uri: process.env.REDIS_URI
    },
    tf: {
        apiKey: process.env.TF_API_KEY
    },
    sentry: {
        uri: process.env.SENTRY_URI
    },
    rp: {
        keyId: process.env.RP_KEY_ID,
        secret: process.env.RP_SECRET_KEY
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    },
    dollar: {
        accessCode: process.env.EXCHANGE_API_RATE_ACCESS_CODE,
        avApiKey: process.env.ALPHAVANTAGE_API_KEY
    },
    ip: {
        apiKey: process.env.IP_API_KEY
    }

}




const test = {
    environment: process.env.NODE_ENV,
    hosting: {
        host: process.env.DEV_host,
        port: parseInt(process.env.DEV_port) || 3000
    },
    mongo: {
        uri: process.env.DEV_MONGO_DB_URI,
        db: process.env.DEV_MONGO_DB_NAME
    },
    utils: {
        encryptionSalt: process.env.DEV_SALT_ENC
    },
    jwt: {
        tokenSecret: process.env.TOKEN_SECRET
    },
    sendgrid: {
        key: process.env.SENDGRID_KEY
    },
    aws: {
        accessId: process.env.AWS_ACCESS_ID,
        secretKey: process.env.AWS_SECRET_KEY,
        s3BucketArticles: process.env.AWS_S3_BUCKET_ARTICLES,
        s3BucketProfile: process.env.AWS_S3_BUCKET_PROFILE,
        urlForArticles: process.env.URL_FOR_ARTICLES,
        urlForProfile: process.env.URL_FOR_PROFILE
    },
    redis: {
        uri: process.env.REDIS_URI
    },
    tf: {
        apiKey: process.env.TF_API_KEY
    },
    rp: {
        keyId: process.env.RP_KEY_ID,
        secret: process.env.RP_SECRET_KEY
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    },
    dollar: {
        accessCode: process.env.EXCHANGE_API_RATE_ACCESS_CODE,
        avApiKey: process.env.ALPHAVANTAGE_API_KEY
    },
    ip: {
        apiKey: process.env.IP_API_KEY
    }
}


// config = {
//     dev,
//     prod,
//     local,
//     test
// }

// module.exports = config[env];

module.export = devEnvVariables;
//module.exports = { getData }