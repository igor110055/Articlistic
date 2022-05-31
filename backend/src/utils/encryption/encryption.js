var config = require('../../../config');
var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');
const logger = require('../logger');
/**
 * Encrypts the object using RC4 with the encryption salt
 * @param object - The object to be encrypted.
 * @returns The encrypted string.
 */

function encryptForFrontend(object) {
    let objToBeEncrypted = JSON.stringify(object);
    let encrypted = crypto.RC4.encrypt(objToBeEncrypted, config.utils.encryptionSalt);
    return encrypted.toString();
}


/**
 * Decrypt the encrypted information using the RC4 algorithm and the encryption salt. 
 * Used to decrypt the token when is sent to the frontend from backend. 
 * @param encryptedInfo - The encrypted information that you want to decrypt.
 * @returns The decrypted object is being returned.
 */

function decryptForFrontend(encryptedInfo) {
    let decrypted = crypto.RC4.decrypt(encryptedInfo, config.utils.encryptionSalt); //A decrypted version, although you can't read this. 
    let sensibleObj = JSON.parse(decrypted.toString(crypto.enc.Utf8)); //Specific type of string and we parse it into an object 
    logger.debug(sensibleObj);
    return sensibleObj;
}

/**
 * Encrypts a string using the encryption salt - used while sending it to the backend.
 * @param object - The object to be encrypted.
 * @returns The encrypted string.
 */

function encrypt(object) {
    let objToBeEncrypted = JSON.stringify(object);
    let encrypted = crypto.AES.encrypt(objToBeEncrypted, config.utils.encryptionSalt); // This crypto library function encrypts only strings. 
    logger.debug(encrypted.toString());
    return encrypted.toString();
}

/**
 * Decrypts the encrypted information using the encryption salt. Used in middleware.
 * @param encryptedInfo - The encrypted information that you want to decrypt.
 * @returns The decrypted object.
 */

function decrypt(encryptedInfo) {
    let decrypted = crypto.AES.decrypt(encryptedInfo, config.utils.encryptionSalt); //A decrypted version, although you can't read this. 
    let sensibleObj = JSON.parse(decrypted.toString(crypto.enc.Utf8)); //Specific type of string and we parse it into an object 
    return sensibleObj; //This is the parsed object. 
}


/**
 * Encrypt a string using the encryption salt
 * @param string - The string you want to encrypt.
 * @returns The encrypted string.
 */

function staticEncrypt(string) {
    let encrypted = jwt.sign(string, config.utils.encryptionSalt);
    return encrypted;
}

function staticDecrypt(string) {
    let decrypted = jwt.decode(string);
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
    encryptForFrontend,
    decryptForFrontend,
    staticEncrypt,
    staticDecrypt
}