import { put, call, takeLatest } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  getRequest,
  postRequest,
  authPostRequest,
} from "../../utils/apiRequests";
import {
  SEND_PROFILE_INFO_INIT,
  LOGIN_INIT,
  CHECK_USERNAME_INIT,
  GET_OTP_INIT,
  VERIFY_OTP_INIT,
  GET_EMAIL_OTP_INIT,
  VERIFY_EMAIL_OTP_INIT,
  FORGOT_GET_OTP_INIT,
  FORGOT_VERIFY_OTP_INIT,
  FORGOT_GET_EMAIL_OTP_INIT,
  FORGOT_VERIFY_EMAIL_OTP_INIT,
  RESET_PASSWORD_INIT,
  LOGOUT_INIT,
  GET_REFRESH_TOKEN_INIT,
} from "../../utils/actionTypes";
import {
  sendProfileInfoSuccess,
  sendProfileInfoFailure,
  loginSuccess,
  loginFailure,
  checkUsernameSuccess,
  checkUsernameFailure,
  getOTPSuccess,
  getOTPFailure,
  verifyOTPSuccess,
  verifyOTPFailure,
  getEmailOTPSuccess,
  getEmailOTPFailure,
  verifyEmailOTPSuccess,
  verifyEmailOTPFailure,
  getForgotOTPSuccess,
  getForgotOTPFailure,
  verifyForgotOTPSuccess,
  verifyForgotOTPFailure,
  getForgotEmailOTPSuccess,
  getForgotEmailOTPFailure,
  verifyForgotEmailOTPSuccess,
  verifyForgotEmailOTPFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  logoutSuccess,
  logoutFailure,
  getRefreshTokenSuccess,
  getRefreshTokenFailure,
} from "./loginSignupAction";
import Cookie from "js-cookie";
import CryptoJS from "crypto-js";

function* sendProfileInfo(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload.params;
    // console.log(headers);
    const url = `${baseURL}/${endPoints.createUser}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(sendProfileInfoSuccess(data));
    } else {
      yield put(sendProfileInfoFailure(data.message));
    }
  } catch (err) {
    yield put(sendProfileInfoFailure(err.message));
  }
}

export function* sendProfileInfoSaga() {
  yield takeLatest(SEND_PROFILE_INFO_INIT, sendProfileInfo);
}

function* login(action) {
  try {
    const headers = action.payload.params;
    // const params = new URLSearchParams(headers);
    // console.log(headers);
    const url = `${baseURL}/${endPoints.login}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error && !data.status) {
      yield put(loginSuccess(data));
      // console.log(data.accessToken);
      // console.log(data.refreshToken);
      // const encRefreshToken = CryptoJS.AES.encrypt(data.refreshToken, 'secretKeyNotToBeShared').toString();
      // const encAccessToken = CryptoJS.AES.encrypt(data.accessToken, 'secretKeyNotToBeShared').toString();
      Cookie.set("refreshToken", data.refreshToken, { expires: 30 });
      Cookie.set("accessToken", data.accessToken, { expires: 7 });
      Cookie.set("oneDayBeforeAccessToken", true, { expires: 6 });
    } else {
      yield put(loginFailure(data.message));
    }
  } catch (err) {
    yield put(loginFailure(err.message));
  }
}

export function* loginSaga() {
  yield takeLatest(LOGIN_INIT, login);
}

function* checkUsername(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams({ username: headers });
    const url = `${baseURL}/${endPoints.checkUsername}?${params}`;
    const data = yield call(getRequest, url);
    if (!data.error) {
      yield put(checkUsernameSuccess(data));
    } else {
      // console.log(data);
      yield put(checkUsernameFailure(data.message));
    }
  } catch (err) {
    yield put(checkUsernameFailure(err.message));
  }
}

export function* checkUsernameSaga() {
  yield takeLatest(CHECK_USERNAME_INIT, checkUsername);
}

function* getOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams(headers);
    // console.log(headers);
    const url = `${baseURL}/${endPoints.sendOTP}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(getOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(getOTPFailure(data.message));
    }
  } catch (err) {
    yield put(getOTPFailure(err.message));
  }
}

export function* getOTPSaga() {
  yield takeLatest(GET_OTP_INIT, getOTP);
}

function* verifyOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams(headers);
    const url = `${baseURL}/${endPoints.verifyOTP}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(verifyOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(verifyOTPFailure(data.message));
    }
  } catch (err) {
    yield put(verifyOTPFailure(err.message));
  }
}

export function* verifyOTPSaga() {
  yield takeLatest(VERIFY_OTP_INIT, verifyOTP);
}

function* getEmailOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams({ email: headers });
    // console.log(headers);
    const url = `${baseURL}/${endPoints.sendEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    if (!data.error) {
      yield put(getEmailOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(getEmailOTPFailure(data.message));
    }
  } catch (err) {
    yield put(getEmailOTPFailure(err.message));
  }
}

export function* getEmailOTPSaga() {
  yield takeLatest(GET_EMAIL_OTP_INIT, getEmailOTP);
}

function* verifyEmailOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams(headers);
    const url = `${baseURL}/${endPoints.verifyEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    if (!data.error) {
      yield put(verifyEmailOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(verifyEmailOTPFailure(data.message));
    }
  } catch (err) {
    yield put(verifyEmailOTPFailure(err.message));
  }
}

export function* verifyEmailOTPSaga() {
  yield takeLatest(VERIFY_EMAIL_OTP_INIT, verifyEmailOTP);
}

function* getForgotOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams({ phone: headers });
    // console.log(headers);
    const url = `${baseURL}/${endPoints.forgotSendOTP}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(getForgotOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(getForgotOTPFailure(data.message));
    }
  } catch (err) {
    yield put(getForgotOTPFailure(err.message));
  }
}

export function* getForgotOTPSaga() {
  yield takeLatest(FORGOT_GET_OTP_INIT, getForgotOTP);
}

function* verifyForgotOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams(headers);
    const url = `${baseURL}/${endPoints.forgotVerifyOTP}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(verifyForgotOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(verifyForgotOTPFailure(data.message));
    }
  } catch (err) {
    yield put(verifyForgotOTPFailure(err.message));
  }
}

export function* verifyForgotOTPSaga() {
  yield takeLatest(FORGOT_VERIFY_OTP_INIT, verifyForgotOTP);
}

function* getForgotEmailOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams({ email: headers });
    // console.log(headers);
    const url = `${baseURL}/${endPoints.forgotSendEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    if (!data.error) {
      yield put(getForgotEmailOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(getForgotEmailOTPFailure(data.message));
    }
  } catch (err) {
    yield put(getForgotEmailOTPFailure(err.message));
  }
}

export function* getForgotEmailOTPSaga() {
  yield takeLatest(FORGOT_GET_EMAIL_OTP_INIT, getForgotEmailOTP);
}

function* verifyForgotEmailOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    const params = new URLSearchParams(headers);
    const url = `${baseURL}/${endPoints.forgotVerifyEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    if (!data.error) {
      yield put(verifyForgotEmailOTPSuccess(data));
    } else {
      // console.log(data);
      yield put(verifyForgotEmailOTPFailure(data.message));
    }
  } catch (err) {
    yield put(verifyForgotEmailOTPFailure(err.message));
  }
}

export function* verifyForgotEmailOTPSaga() {
  yield takeLatest(FORGOT_VERIFY_EMAIL_OTP_INIT, verifyForgotEmailOTP);
}

function* resetPassword(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload;
    // console.log(headers);
    const url = `${baseURL}/${endPoints.resetPassword}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(resetPasswordSuccess(data));
    } else {
      // console.log(data);
      yield put(resetPasswordFailure(data.message));
    }
  } catch (err) {
    yield put(resetPasswordFailure(err.message));
  }
}

export function* resetPasswordSaga() {
  yield takeLatest(RESET_PASSWORD_INIT, resetPassword);
}

function* logout(action) {
  try {
    // const { headers } = action.payload;
    const payload = action.payload;
    const headers = {
      Authorization: payload.accessToken,
    };
    // console.log(payload, headers);
    // console.log(headers);
    const url = `${baseURL}/${endPoints.logout}`;
    const data = yield call(authPostRequest, url, payload, headers);
    if (!data.error) {
      yield put(logoutSuccess(data));
    } else {
      // console.log(data);
      yield put(logoutFailure(data.message));
    }
  } catch (err) {
    yield put(logoutFailure(err.message));
  }
}

export function* logoutSaga() {
  yield takeLatest(LOGOUT_INIT, logout);
}

function* getRefreshToken(action) {
  try {
    // const { headers } = action.payload;
    const payload = action.payload;
    const headers = {
      Authorization: payload.headers,
    };
    // console.log(headers);
    const url = `${baseURL}/${endPoints.refreshToken}`;
    const data = yield call(authPostRequest, url, {}, headers);
    if (!data.error) {
      yield put(getRefreshTokenSuccess(data));
    } else {
      // console.log(data);
      yield put(getRefreshTokenFailure(data.message));
    }
  } catch (err) {
    yield put(getRefreshTokenFailure(err.message));
  }
}

export function* getRefreshTokenSaga() {
  yield takeLatest(GET_REFRESH_TOKEN_INIT, getRefreshToken);
}
