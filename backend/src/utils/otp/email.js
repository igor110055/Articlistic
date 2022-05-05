var sgMail = require("@sendgrid/mail");
const config = require('../../../config');
const logger = require("../logger");

async function sendEmail(email, otp) {
    sgMail.setApiKey(config.sendgrid.key);
    var msg = {
        to: email,
        from: 'info@attentioun.com',
        subject: 'Attentioun | Verification code for your email',
        text: `Your Attentioun verification code is: ${otp}. Don't share this code with anyone; our employees will never ask for the code.`
        // html: data.html,
    };
    try {
        await sgMail.send(msg);
    } catch (e) {
        logger.debug(e);
        throw e;
    }

}



module.exports = {
    sendEmail,
}