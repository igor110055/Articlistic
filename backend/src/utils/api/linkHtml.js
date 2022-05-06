var axios = require('axios').default;

const logger = require('../logger');



async function getHTMLForLink(link) {

    const {
        data
    } = await axios.get(link);

    return data;
}


module.exports = {
    getHTMLForLink
}