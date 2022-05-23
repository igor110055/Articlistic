require('dotenv').config();

const env = process.env.NODE_ENV;

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
    },


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


const config = {
    dev,
    prod,
    local,
    test
}

module.exports = config[env];