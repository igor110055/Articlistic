const logger = require('../../utils/logger');
const express = require('express');
const Razorpay = require('razorpay');
const useAuth = require('../../middleware/auth')
const verifyOTP = require('../../utils/functions/verifyOTP')
const otp = require('../../utils/otp/index');


const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const NetworkError = require('../../errors/NetworkError');
const ServiceError = require('../../errors/ServiceError');
const api = require('../../utils/api');

var {
    createHmac
} = require('crypto');


const {
    v4: uuidv4
} = require('uuid');
const mongo = require('../../db/mongo');
const config = require('../../../config');
const axios = require('axios');
const Pin = require('../../utils/encryption/pin');
const BadRequestError = require('../../errors/BadRequestError');
const auth = require('../../middleware/auth');
const {
    staticDecrypt
} = require('../../utils/encryption');
const verifyEmailOTP = require('../../utils/functions/verifyEmailOTP');
const articleCheck = require('../../middleware/articleCheck');
const checkPin = require('../../middleware/checkPin');
const {
    WALLET_ATT_CUT_RATE,
    TYPE_WALLET_WITHDRAW,
    TYPE_WALLET_ACTIVATION,
    TYPE_WALLET_FUND_ACCOUNT,
    TYPE_RESET_PIN
} = require('../../../constants');


module.exports = function walletRouter() {

    return new express.Router()
        /**
         * Onboarding APIs.
         * Adding Funds APIs.
         * Internal Transaction APIs.
         * Withdrawing Earnings APIs. 
         */

        .post('/activate/otp', auth(false, false, true), sendOTPForWalletActivation)
        .post('/activate', auth(false, false, true), activateWallet)

        .post('/resetPIN/otp', auth(false, false, true), sendResetPinOTP)
        .post('/resetPIN', auth(false, false, true), resetPIN)

        .post('/funds/order', auth(false, false, true), createOrder)
        .post('/funds/confirm', auth(), confirmOrder)

        .post('/tip/selection', auth(false, false, true), articleCheck(true), checkPin(), tipPassage)

        .post('/contact', auth(false, false, true), createContact)
        .patch('/earnings/fa', auth(false, false, true), createFundAccount)
        .post('/earnings/fa/otp', auth(false, false, true), sendOTPForSettingPayoutDetails)
        .post('/earnings/otp', auth(false, false, true), sendOTPForWithdraw)
        .post('/earnings/withdraw', auth(false, false, true), checkPin(), withdrawEarnings)
        .post('/earnings/self', auth(false, false, true), checkPin(), transferToWallet);


    async function sendResetPinOTP(req, res) {
        const routeName = 'send reset pin otp';
        const user = req.user;

        const email = staticDecrypt(user.email);

        await createAndSendEmail(TYPE_RESET_PIN, email, routeName);

        return res.status(200).send({
            message: 'otp sent'
        })

    }

    async function transferToWallet(req, res) {
        const routeName = 'transfer to wallet';
        var user = req.user;
        const username = user.username;

        const {
            amount
        } = req.body;

        if (!amount || amount <= 0) throw new MissingParamError('Amount required', routeName);


        /**
         * Database query to transfer from one wallet to another. 
         */

        try {
            var mres = await mongo.transactionWalletEarnings.convertEarningsToWalletCredits(amount, username);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!mres) {
            throw new BadRequestError('Not enough balance', routeName);
        }

        return res.status(200).send({
            message: `Transferred ${amount} to Wallet from earnings`
        })

    }

    async function tipPassage(req, res) {
        const routeName = 'tip - passage';
        var user = req.user;
        var article = req.article;

        const writer = article.username;

        const {
            amount,
            selection,
            message
        } = req.body;

        if (!amount || !selection) {
            throw new MissingParamError('Required parameters missing', routeName);
        }


        if (writer === user.username) {
            throw new BadRequestError('Can not tip yourself', routeName);
        }

        /**
         * Convert amount to credits. 
         */
        var credits;
        if (user.international) {

            try {
                var dollarValue = await mongo.dollarValue.getDollarValue();
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            credits = dollarValue * amount;

        } else {
            credits = amount;
        }


        if (credits < 30) {
            throw new BadRequestError('Minimum amount to tip is 30', routeName);
        }

        /**
         * Compute Taxes, currently we have: 
         * 1. Attentioun Tax - 10%
         */

        const attentiounTaxRate = WALLET_ATT_CUT_RATE;
        const attTax = attentiounTaxRate * credits;

        const earnings = credits - attTax;

        /**
         * MongoDB query which does the following: 
         * 1. Check Balance if it's sufficient 
         * 2. Deduct amount which is there in wallet of user
         * 3. Add Earnings In Writer Section 
         * 4. Insert One Transaction in internal-txn table
         * We can do step 1&2 at the end after doing research on locking 
         */

        const tipId = uuidv4();
        try {
            var tipRes = await mongo.transactionWalletTip.tip(tipId, user.username, writer, article.articleId, selection, earnings, attTax, 0, credits, message)
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!tipRes) {
            throw new BadRequestError('You do not have sufficient balance', routeName);
        }

        /**
         * Return success. 
         */

        return res.status(200).send({
            message: 'success'
        })




    }

    async function sendOTPForWalletActivation(req, res) {
        const routeName = 'send otp - wallet';

        const user = req.user;

        if (user.wallet) throw new BadRequestError('User already has wallet activated', routeName);

        const email = staticDecrypt(user.email);

        await createAndSendEmail(TYPE_WALLET_ACTIVATION, email, routeName);

        return res.status(200).send({
            message: 'otp sent'
        })
    }

    async function createOrder(req, res) {

        const routeName = 'create order - add funds';

        var {
            amount
        } = req.query;

        amount = parseFloat(amount);

        var user = req.user;

        /**
         * Check if user is Indian or International 
         * And set the Currency accordingly
         */

        var currency, credits;
        if (user.international) {
            currency = 'USD';
            /**
             * Call mongoDB query to check for dollar value. 
             * Assign amount: credits = amount * dollar value.  
             */
            var dollarValue;

            try {
                dollarValue = await mongo.dollarValue.getDollarValue();
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            if (!dollarValue) throw new ServiceError('dollar-value-fetch', routeName, "Something went wrong");

            credits = amount * dollarValue;

        } else {
            currency = 'INR';
            credits = amount;
        }

        if (!amount) throw new MissingParamError('Amount is required parameter', routeName);


        const instance = new Razorpay({
            key_id: config.rp.keyId,
            key_secret: config.rp.secret,
        });


        const options = {
            amount: amount * 100,
            currency: currency
        };


        try {
            var order = await instance.orders.create(options);
        } catch (e) {
            throw new ServiceError('razorpay-create-order', routeName, e);
        }

        if (!order) throw new ServiceError('razorpay-create-order', routeName, 'Order generated was null');

        const orderId = order.id;


        try {

            await mongo.walletAdd.createOrder(user.username, amount, orderId, credits, currency);

        } catch (e) {

            throw new DatabaseError(routeName, e);

        }

        return res.status(200).send({
            'message': 'order created',
            orderId,
            amount,
            credits
        })
    }

    async function confirmOrder(req, res) {
        const routeName = 'confirm order';

        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        const username = req.username;

        if (!orderCreationId || !razorpayPaymentId || !razorpaySignature || !razorpayOrderId) {
            throw new MissingParamError('Required parameters missing', routeName);
        }

        /*
         * Creating our own digest
         * The format should be like this:
         * digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
         */

        const shasum = createHmac("sha256", config.rp.secret);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        /**
         * Comparing our digest with the actual signature
         */

        if (digest !== razorpaySignature) {
            throw new NotAuthenticatedError('Razorpay - Something went wrong', routeName);
        }

        try {
            await mongo.transactionWalletAddUser.addMoneyToWallet(username, razorpayOrderId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        return res.status(200).send({
            'message': 'success',
            'orderId': razorpayOrderId
        })

    }

    async function activateWallet(req, res) {
        const routeName = 'activate wallet';

        /**
         * Algorithm: 
         * 1. Check OTP
         * 2. Check if wallet is activated already
         * 3. Activate wallet and set balance = 0 
         * 4. and then Encrypt PIN and store it in database. 
         * 
         */

        var user = req.user;

        var {
            pin,
            otp
        } = req.body;

        const email = staticDecrypt(user.email);
        const username = user.username;


        if (!pin || !otp || pin.length != 6) {
            throw new MissingParamError("Required parameters missing or bad params", routeName);
        }

        if (user.wallet) {
            throw new BadRequestError('Wallet already activated', routeName);
        }



        pin = pin.toString();

        await verifyEmailOTP(otp, email, routeName, TYPE_WALLET_ACTIVATION);

        pin = await Pin.hash(pin);

        try {
            await mongo.users.activateWallet(username, pin);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'Congrats! Wallet activated!'
        });

    }

    async function resetPIN(req, res) {
        const routeName = 'reset PIN';

        var user = req.user;
        const username = user.username;
        const email = staticDecrypt(user.email);
        var {
            newPin,
            otp
        } = req.body;

        newPin = newPin.toString();
        if (!newPin || !otp || newPin.length != 6) {
            throw new MissingParamError("Required parameters missing or bad params", routeName);
        }

        await verifyEmailOTP(otp.toString(), email, routeName, TYPE_RESET_PIN);


        if (user.wallet) {
            newPin = await Pin.hash(newPin);

            try {
                await mongo.users.resetPIN(username, newPin);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }


        } else {
            throw new BadRequestError('Can not reset PIN', routeName);
        }


        return res.status(200).send({
            message: 'success'
        })

    }

    async function createContact(req, res) {
        const routeName = 'create contact';
        const user = req.user;
        var message;
        const name = user.name;
        const email = staticDecrypt(user.email);
        const username = user.username;

        if (!user.wallet) {
            throw new BadRequestError('wallet not activated', routeName);
        }

        var contactId;
        if (user.wallet.contactId) {
            message = "Wallet already has contact ID";

            return res.status(200).send({
                message
            })
        } else {

            try {
                contactId = (await api.razorpay.createContact(name, email, username)).id;
            } catch (e) {
                throw new ServiceError('razorpay contact id', routeName, e);
            }

            if (!contactId) {
                throw new ServiceError('razorpay contact id', routeName, "Contact ID not generated ");
            }
            /**
             * Database query for setting contactId. 
             */
            try {
                await mongo.users.setContactId(username, contactId);
            } catch (e) {
                throw new DatabaseError(routeName, e);
            }

            return res.status(201).send({
                message: 'contact id created'
            })

        }



    }

    async function sendOTPForSettingPayoutDetails(req, res) {
        const routeName = 'send otp for setting payouts';
        const user = req.user;
        const email = staticDecrypt(user.email);


        await createAndSendEmail(TYPE_WALLET_FUND_ACCOUNT, email, routeName);

        return res.status(200).send({
            message: 'otp sent'
        })

    }

    async function createFundAccount(req, res) {
        const routeName = 'create fund';
        const user = req.user;
        const email = staticDecrypt(req.user.email);

        /**
         * Take type from user. 
         * If UPI - then only ask for UPI ID. 
         * If Bank - ask for accNo, name & if-sc code
         */
        const {
            name,
            type,
            ifsc,
            accNo,
            upiId,
            otp
        } = req.body;

        /**
         * Validation happening out here. 
         */


        if (type !== 'upi' && type !== 'bank') {
            throw new BadRequestError('Type not right', routeName);
        }

        if (!user.wallet || !user.wallet.contactId || !otp) {
            throw new BadRequestError('Contact ID not created', routeName);
        }


        if (type === 'upi') {
            if (!upiId) {
                throw new BadRequestError('upi id is not sent', routeName);
            }
        } else {
            if (!ifsc || !name || !accNo) {
                throw new BadRequestError('bank details not sufficient', routeName);
            }
        }

        logger.debug(user.wallet);
        const contactId = user.wallet.contactId;



        /**
         * Checks otp here. 
         */

        try {
            var mres = await mongo.email.checkWalletOTP(email, otp.toString(), TYPE_WALLET_FUND_ACCOUNT)
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        if (!mres) {
            throw new NotAuthenticatedError('Code not correct', routeName);
        }

        deleteAllOTPs(email, TYPE_WALLET_FUND_ACCOUNT);

        /**
         * Creating a fund account using Razorpay APIs.
         */
        var fundAccount, faId;
        try {


            /**
             * Fund account id for UPI comes from this response.fund_account_id 
             * while for bank account it comes from response.id 
             */

            if (type === "upi") {
                fundAccount = await api.razorpay.createUPIFundAccount(upiId, contactId);


                faId = fundAccount.fund_account_id;

            } else {
                fundAccount = await api.razorpay.createBankFundAccount(name, ifsc, contactId, accNo);
                faId = fundAccount.id;
            }


        } catch (e) {
            throw new ServiceError('api-rp-create-fund-acc', routeName, e);
        }

        logger.debug(fundAccount);

        /**
         * Add this information to mongoDB
         */


        /**
         * There will be only one faId -
         *  which will be the primary id & multiple fund accounts in the database. 
         * This single faId will be where the money will be credited. 
         */


        try {
            await mongo.users.setFundAccount(user.username, faId, fundAccount);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'Success'
        })
    }

    async function sendOTPForWithdraw(req, res) {
        const routeName = 'send otp for withdraw';
        const user = req.user;

        if (user.international) {
            throw new BadRequestError('International users not allowed to payout', routeName);
        }

        const email = staticDecrypt(user.email);

        await createAndSendEmail(TYPE_WALLET_WITHDRAW, email, routeName);

        return res.status(200).send({
            message: 'otp sent'
        })

    }

    async function withdrawEarnings(req, res) {

        const routeName = 'withdraw earnings';
        const user = req.user;
        const username = user.username;
        const fundAccount = user.fundAccount;
        const email = staticDecrypt(req.user.email);

        const {
            code,
            amount
        } = req.query;

        if (user.international) {
            throw new BadRequestError('International users not allowed to payout', routeName);
        }

        if (amount < 500) {
            throw new BadRequestError('Amount required should be >500');
        }

        /**
         * Withdraw OTP check. 
         */
        try {
            var otpRes = mongo.email.checkWalletOTP(email, code, TYPE_WALLET_WITHDRAW);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        if (!otpRes) {
            throw new NotAuthenticatedError('Bad OTP', routeName);
        }

        deleteAllOTPs(email, TYPE_WALLET_WITHDRAW);


        /**
         * Database query for Withdrawal of money
         * Create entry for withdraw & deduct from earnings. 
         * Get the reference ID from here. 
         */

        const payoutId = uuidv4();
        try {
            var payoutRes = await mongo.transactionUserPayout.payout(amount, username, payoutId);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }


        if (!payoutRes) {
            throw new BadRequestError('Sufficient Earnings not available', routeName);
        }


        try {
            await api.razorpay.createPayout(amount, fundAccount, payoutId);
        } catch (e) {

            /**
             * If we try to return the transaction here.
             * There are two problems: 
             * 1. If that error goes into errors - we anyway would have to check all the records. 
             * 2.  
             */
            throw new ServiceError('razorpay-payout', routeName, e);
        }

        //Database Query. 
        //


        return res.status(200).send({
            message: 'success'
        });


    }

}

/**
 * It creates a random 6 digit number, saves it to the database, and then sends it to the user's email.
 * @param type - TYPE_WALLET_FUND_ACCOUNT
 * @param email - email address
 * @param routeName - The name of the route that is calling this function
 */

const createAndSendEmail = async (type, email, routeName) => {


    let code = Math.floor(100000 + Math.random() * 900000);
    code = code.toString();

    try {
        await mongo.email.createWalletOTP(email, code, type);
    } catch (e) {
        throw new DatabaseError(routeName, e);
    }

    try {

        if (type === TYPE_WALLET_FUND_ACCOUNT) {
            await otp.email.changePayoutAccountDetails(email, code);
        } else if (type === TYPE_RESET_PIN) {
            await otp.email.sendResetPinOTP(email, code);
        } else if (type === TYPE_WALLET_ACTIVATION) {
            await otp.email.walletActivationOTP(email, code)
        } else if (type === TYPE_WALLET_WITHDRAW) {
            await otp.email.withdraw(email, otp);
        }

    } catch (e) {

        try {
            await mongo.email.deleteOTP(code);
        } catch (e) {
            logger.fatal(e);
        }

        throw new ServiceError('Send Email OTP - RP', routeName, e);
    }


}

const deleteAllOTPs = async (email, type) => {
    try {
        mongo.email.deleteAllWalletOTPsWithEmail(email, type);
    } catch (e) {
        logger.fatal('Some OTPs did not get deleted');
    }
}