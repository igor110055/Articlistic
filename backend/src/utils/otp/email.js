var sgMail = require("@sendgrid/mail");
const config = require('../../../config');
const logger = require("../logger");

const from = 'info@attentioun.com';
const warning = "\nDon't share this code with anyone; our employees will never ask for the code.";

async function sendVerificationOTP(email, otp) {
    const subject = 'Attentioun | Verification code for your email';
    const body = `Your Attentioun verification code is: ${otp}.` + warning;
    await send(email, subject, body);
}

async function sendResetPinOTP(email, otp) {
    const subject = 'Attentioun | Reset your wallet PIN';
    const body = `Your Verification Code for Resetting wallet PIN is ${otp}.` + warning;

    await send(email, subject, body);
}

async function walletActivationOTP(email, otp) {
    const subject = 'Attentioun | Wallet Activation Code';
    const body = `Your Wallet Activation code for Attentioun is ${otp}. Happy Funding!` + warning;

    await send(email, subject, body);
}

async function changePayoutAccountDetails(email, otp) {
    const subject = 'Attentioun | Modification of Payout Details';
    const body = `Your One Time Password is ${otp}. Go get your payouts!` + warning;

    await send(email, subject, body);
}


async function withdraw(email, otp) {
    const subject = 'Attentioun | Withdraw Request';
    const body = `Your One Time Password is ${otp}. Withdraw your money!` + warning;

    await send(email, subject, body);
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




module.exports = {
    sendVerificationOTP,
    walletActivationOTP,
    changePayoutAccountDetails,
    sendResetPinOTP,
    withdraw
}