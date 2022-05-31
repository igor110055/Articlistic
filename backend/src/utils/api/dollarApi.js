var axios = require('axios').default;

const config = require('../../../config');
const logger = require('../logger');

const accessCode = config.dollar.avApiKey;
const timeSeriesKey = "Time Series FX (Daily)";
const closeKey = "4. close";

async function getDollarValue() {

    const uri = "https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=INR&apikey=" + accessCode;
    const {
        data
    } = await axios.get(uri);


    const timeSeriesObject = data[timeSeriesKey];
    const date = Object.keys(timeSeriesObject)[0];


    const dollarValue = timeSeriesObject[date][closeKey];

    return {
        date,
        dollarValue
    }

}




module.exports = {
    getDollarValue
}