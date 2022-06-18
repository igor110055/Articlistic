const {
    MongoClient
} = require('mongodb');
const {
    MDB_COLLECTION_ARTICLES
} = require('../../../../constants');
const {
    MDB
} = require('../client');
const config = require('../../../../config');
async function main() {
    let client;
    try {
        client = await MDB.getClient();
    } catch (e) {
        throw "elo";
    }
    const pipeline = [{
        '$match': {
            'operationType': 'insert',
            'status': 'PUBLISHED'
        }
    }];
    monitorListingsUsingEventEmitter(client, 600000, pipeline);
}
/**
 * Monitor listings in the listingsAndReviews collections for changes
 * This function uses the on() function from the EventEmitter class to monitor changes
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Number} timeInMs The amount of time in ms to monitor listings
 * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
 */
async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []) {
    const collection = client.db(config.mongo.db).collection(MDB_COLLECTION_ARTICLES);
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
    const changeStream = collection.watch(pipeline);
    changeStream.on('change', (next) => {
        // console.log(/);
        const doc = next.fullDocument
        doc.type = 'newArticle';
        parser(doc);
    });
}
function parser(document) {
    const type = document.type;
    if (type === 'newArticle') {
        const writerUsername = document.username;
        const articleTitle = document.public.title;
        const message = `${writerUsername} wrote an article called ${articleTitle}`;
        const map = {
            type: message
        };
        subscribeToTopicKafka(map)
    }
}
async function newArticleAlert(map, writerUsername) {
    await subscribeToTopicKafka();
}
async function subscribeToTopicKafka(topic) {
}
const Kafka = require('node-rdkafka');
const configFromCli = () => {
    return {
        'bootstrap.servers': 'pkc-l7pr2.ap-south-1.aws.confluent.cloud:9092',
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': 'O3MWJCK2WD2X2UHG',
        'sasl.password': 'ZJ4dwOC7lpYhHyneWqkBLg310FE19a6/FR/9x/3rbem2KxlgZnd0dmji1bTmWmgs'
    }
}
const ERR_TOPIC_ALREADY_EXISTS = 36;
function ensureTopicExists(config) {
    const adminClient = Kafka.AdminClient.create({
        'bootstrap.servers': config['bootstrap.servers'],
        'sasl.username': config['sasl.username'],
        'sasl.password': config['sasl.password'],
        'security.protocol': config['security.protocol'],
        'sasl.mechanisms': config['sasl.mechanisms']
    });
    return new Promise((resolve, reject) => {
        adminClient.createTopic({
            topic: config.topic,
            num_partitions: 1,
            replication_factor: 3
        }, (err) => {
            if (!err) {
                console.log(`Created topic ${config.topic}`);
                return resolve();
            }
            if (err.code === ERR_TOPIC_ALREADY_EXISTS) {
                return resolve();
            }
            return reject(err);
        });
    });
}
function createProducer(config, onDeliveryReport) {
    const producer = new Kafka.Producer({
        'bootstrap.servers': config['bootstrap.servers'],
        'sasl.username': config['sasl.username'],
        'sasl.password': config['sasl.password'],
        'security.protocol': config['security.protocol'],
        'sasl.mechanisms': config['sasl.mechanisms'],
        'dr_msg_cb': true
    });
    return new Promise((resolve, reject) => {
        producer
            .on('ready', () => resolve(producer))
            .on('delivery-report', onDeliveryReport)
            .on('event.error', (err) => {
                console.warn('event.error', err);
                reject(err);
            });
        producer.connect();
    });
}
async function produceExample() {
    const config = configFromCli();
    if (config.usage) {
        return console.log(config.usage);
    }
    await ensureTopicExists(config);
    const producer = await createProducer(config, (err, report) => {
        if (err) {
            console.warn('Error producing', err)
        } else {
            const {
                topic,
                partition,
                value
            } = report;
            console.log(`Successfully produced record to topic "${topic}" partition ${partition} ${value}`);
        }
    });
    for (let idx = 0; idx < 10; ++idx) {
        const key = 'alice';
        const value = Buffer.from(JSON.stringify({
            count: idx
        }));
        console.log(`Producing record ${key}\t${value}`);
        producer.produce(config.topic, -1, value, key);
    }
    producer.flush(10000, () => {
        producer.disconnect();
    });
}
produceExample()
    .catch((err) => {
        console.error(`Something went wrong:\n${err}`);
        process.exit(1);
    });
module.exports = {
    main
};