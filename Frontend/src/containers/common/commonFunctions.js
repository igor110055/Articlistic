import Cookie from 'js-cookie';
import crypto from 'crypto-js';

export const getAuthToken = () => {
  const descryptedAccessToken = crypto.RC4.decrypt(Cookie.get('accessToken'), process.env.REACT_APP_ENCRYPTION_SALT).toString(crypto.enc.Utf8);
  const encryptedAccessToken = crypto.AES.encrypt(descryptedAccessToken, process.env.REACT_APP_ENCRYPTION_SALT);
  const temp = encryptedAccessToken.toString();
  return temp
}
