import Cookie from "js-cookie";
import crypto from "crypto-js";
import { encryptionSalt } from "../../utils/apiEndPoints";
export const getAuthToken = () => {
  const descryptedAccessToken = crypto.RC4.decrypt(
    Cookie.get("accessToken"),
    encryptionSalt
  ).toString(crypto.enc.Utf8);
  const encryptedAccessToken = crypto.AES.encrypt(
    descryptedAccessToken,
    encryptionSalt
  );
  const temp = encryptedAccessToken.toString();
  return temp;
};

export const getRefreshToken = () => {
  const descryptedRefreshToken = crypto.RC4.decrypt(
    Cookie.get("refreshToken"),
    encryptionSalt
  ).toString(crypto.enc.Utf8);

  const encryptedRefreshToken = crypto.AES.encrypt(
    descryptedRefreshToken,
    encryptionSalt
  );

  const temp = encryptedRefreshToken.toString();
  return temp;
};
