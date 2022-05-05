var config = require('../../../config');
var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');
const logger = require('../logger');

function encryptForFrontend(object) {
    let objToBeEncrypted = JSON.stringify(object);
    let encrypted = crypto.RC4.encrypt(objToBeEncrypted, config.utils.encryptionSalt);
    return encrypted.toString();
}

function decryptForFrontend(encryptedInfo) {
    let decrypted = crypto.RC4.decrypt(encryptedInfo, config.utils.encryptionSalt); //A decrypted version, although you can't read this. 
    let sensibleObj = JSON.parse(decrypted.toString(crypto.enc.Utf8)); //Specific type of string and we parse it into an object 
    logger.debug(sensibleObj);
    return sensibleObj;
}

// decryptForFrontend('U2FsdGVkX1/3Zby6lhJ90kXV8d6Um9xuko4vVVMTTxw8xYpNRCVCKwLu44zqXOy4woFujgIRaIu9KPEAiGqqdiIP5We/kV8nidRjcO1pXD94wm11hIsEG5/WtjYHj+nT8S9RRvLF9wNROt+vTEm/KRAM586dxORcKUxnOMwR/b/6/JXXWnl7ISicaG448ydagcjJ/qPCs2C4avVy3skKkAIiGjJuJH5yTORqkCheQ8U8F6UCgdBW3SJNHi4=');

function encrypt(object) {
    let objToBeEncrypted = JSON.stringify(object);
    let encrypted = crypto.AES.encrypt(objToBeEncrypted, config.utils.encryptionSalt); // This crypto library function encrypts only strings. 
    logger.debug(encrypted.toString());
    return encrypted.toString();
}


function decrypt(encryptedInfo) {
    let decrypted = crypto.AES.decrypt(encryptedInfo, config.utils.encryptionSalt); //A decrypted version, although you can't read this. 
    let sensibleObj = JSON.parse(decrypted.toString(crypto.enc.Utf8)); //Specific type of string and we parse it into an object 
    return sensibleObj; //This is the parsed object. 
}

function staticEncrypt(string) {
    let encrypted = jwt.sign(string, config.utils.encryptionSalt);
    return encrypted;
}


module.exports = {
    encrypt,
    decrypt,
    encryptForFrontend,
    decryptForFrontend,
    staticEncrypt
}