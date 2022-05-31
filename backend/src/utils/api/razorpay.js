const config = require('../../../config');
const logger = require('../logger');
const axios = require('axios').default;

async function createContact(name, email, username) {

    try {

        const key = Buffer.from(`${config.rp.keyId}:${config.rp.secret}`).toString('base64');
        const contactId = (await axios.post('https://api.razorpay.com/v1/contacts', {
            "name": name,
            "email": email,
            "type": "customer",
            "reference_id": username
        }, {
            headers: {
                Authorization: `Basic ${key}`
            }
        })).data;
        logger.debug(contactId);
        return contactId;
    } catch (e) {
        throw e;
    }
}

async function createBankFundAccount(name, IFSC, contactId, accountNumber) {

    try {

        const key = Buffer.from(`${config.rp.keyId}:${config.rp.secret}`).toString('base64');
        const fa = (await axios.post('https://api.razorpay.com/v1/fund_accounts', {
            "contact_id": contactId,
            "account_type": "bank_account",
            "bank_account": {
                "name": name,
                "ifsc": IFSC,
                "account_number": accountNumber
            }
        }, {
            headers: {
                Authorization: `Basic ${key}`
            }
        })).data;
        return fa;

    } catch (e) {

        throw e;

    }
}

async function createUPIFundAccount(upiId, contactId) {

    try {

        const key = Buffer.from(`${config.rp.keyId}:${config.rp.secret}`).toString('base64');
        const fa = (await axios.post('https://api.razorpay.com/v1/fund_accounts', {
            "account_type": "vpa",
            "contact_id": contactId,
            "vpa": {
                "address": upiId
            }
        }, {
            headers: {
                Authorization: `Basic ${key}`
            }
        })).data;

        const obj = {
            fund_account_id: fa.id,
            vpa: fa.vpa,
            created_at: fa.created_at
        };

        return obj;

    } catch (e) {

        throw e;

    }
}

async function createPayout(amount, fundAccount, referenceId) {

    if (!amount || !fundAccount) {
        throw "Amount is required parameter"
    }

    const attAccNo = config.rp.accountNumber;
    const currency = "INR";
    const mode = "IMPS";
    const purpose = "payout";


    try {

        const key = Buffer.from(`${config.rp.keyId}:${config.rp.secret}`).toString('base64');
        const res = (await axios.post('https://api.razorpay.com/v1/payouts', {
            "account_number": attAccNo,
            "fund_account_id": fundAccount,
            "amount": amount,
            "currency": currency,
            "mode": mode,
            "purpose": purpose,
            "queue_if_low_balance": false,
            "reference_id": referenceId
        }, {
            headers: {
                Authorization: `Basic ${key}`,

            }
        })).data;
        return res;
    } catch (e) {
        throw e;
    }
}


module.exports = {
    createContact,
    createUPIFundAccount,
    createBankFundAccount,
    createPayout
}