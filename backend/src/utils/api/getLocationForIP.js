var axios = require('axios').default;

const config = require('../../../config');
const logger = require('../logger');


const apiKey = config.ip.apiKey;

module.exports = async (ip) => {
    const uri = `https://ipgeolocation.abstractapi.com/v1/?api_key=${apiKey}&ip_address=${ip}`;

    try {

        var {
            data
        } = await axios.get(uri);

    } catch (e) {

        throw e;
    }

    const country = data.country;
    return country;

}