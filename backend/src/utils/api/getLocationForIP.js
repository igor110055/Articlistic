var axios = require('axios').default;

const config = require('../../../config');
const logger = require('../logger');


const apiKey = config.ip.apiKey;

module.exports = async (ip) => {
    const uri = `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}&ip_address=${ip}`;
    var data = {};
    try {

        data = await axios.get(uri);
        logger.info(data);
    } catch (e) {
        logger.debug(e);
        throw e;
    }


    return data.country;

}