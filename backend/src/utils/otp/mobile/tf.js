const config = require('../../../../config');
const TwoFactor = new(require('2factor'))(config.tf.apiKey);
const logger = require('../../logger/index')
var axios = require('axios').default;


async function sendOTP(number) {

    if (config.environment != 'prod') {
        return "attentioun";
    }

    var code = Math.floor(100000 + Math.random() * 900000);

    var otpOptions = {
        otp: code,
        template: 'ATT' // To be updated
    };

    let sessionId = await TwoFactor.sendOTP(number.toString(), otpOptions);
    return sessionId;

}

async function sendOTPToUSA(number) {



    var code = Math.floor(100000 + Math.random() * 900000);
    let link = `https://2factor.in/API/V1/${config.tf.apiKey}/SMS/${number}/${code}/ATT`

    const response = await axios.get(link);


    let sessionId = response.data['Details'];

    return sessionId;
}



async function verifyOTP(sessionId, code) {

    if (config.environment != 'prod') {

        if (code == 123456) {

            return "Verified";

        } else {
            throw "Wrong OTP"
        }
    }

    let res = await TwoFactor.verifyOTP(sessionId, code);

}


module.exports = {
    sendOTP,
    verifyOTP,
    sendOTPToUSA
}