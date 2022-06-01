var sgMail = require("@sendgrid/mail");
var config = require("../../../config");
const logger = require('../logger');

logger.info("-->", config.sendgrid.key);
const from = 'info@attentioun.com';


//This Functions send Welcome mail
async function WelcomeMail(email, name) {
    const subject = "WELCOME TO ATTENTIOUN";
    const body = `Hello ${name}! Your Onboarding is successfully completed and Attentioun welcomes you to the platform.`
    await send(email, subject, body)
}
//WelcomeMail("abhisheksarakanam@attentioun.com", "TEST-1");


async function followNotificationMail(email, writerName) {
    const subject = "ONE MORE ADDED TO YOUR LIST";
    const body = `You just followed ${writerName} on Attentioun.`
    await send(email, subject, body)
}


async function send(emailTo, subject, body) {
    sgMail.setApiKey(config.sendgrid.key);
    var msg = {
        to: emailTo,
        from: from,
        subject: subject,
        text: body
    };

    if (config.env === 'test') return;

    try {
        await sgMail.send(msg);
    } catch (e) {
        logger.error(e);
        throw e;
    }

}


module.exports = { WelcomeMail, followNotificationMail }