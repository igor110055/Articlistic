var axios = require('axios').default;

const config = require('../../../config');
const logger = require('../logger');

const accessCode = config.dollar.accessCode;

async function getDollarValue() {

    const uri = "http://api.exchangeratesapi.io/v1/latest?access_key=" + accessCode;
    const {
        data
    } = await axios.get(uri);
    //Change dollar value thing. 

    const rates = data.rates;
    const eurToUsd = rates["USD"];
    const eurToInr = rates["INR"];

    const usdToInr = eurToInr / eurToUsd;
    logger.debug(usdToInr);
    return usdToInr;
}



module.exports = {
    getDollarValue
}