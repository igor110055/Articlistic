import {
  GET_EMAIL_OTP_INIT,
  VERIFY_EMAIL_OTP_INIT,
  SEND_PROFILE_INFO_INIT,
  CHECK_USERNAME_INIT,
  LOGIN_INIT,
  GET_PICK_FAV_DATA_INIT,
  FOLLOW_WRITER_INIT,
  RESET_PASSWORD_INIT,
  FORGOT_VERIFY_EMAIL_OTP_INIT,
  FORGOT_GET_EMAIL_OTP_INIT,
  LOGOUT_INIT,
  GET_REFRESH_TOKEN_INIT,
} from "../../utils/actionTypes";
import Cookie from "js-cookie";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  postRequest,
  getRequest,
  authGetRequest,
  authPostRequest,
} from "../../utils/apiRequests";
import { put, call, takeLatest, takeEvery } from "redux-saga/effects";
import {
  getEmailOTPSuccess,
  getEmailOTPFailure,
  verifyEmailOTPFailure,
  verifyEmailOTPSuccess,
  sendProfileInfoSuccess,
  sendProfileInfoFailure,
  checkUsernameSuccess,
  checkUsernameFailure,
  loginFailure,
  loginSuccess,
  getPickFavDataFailure,
  getPickFavDataSuccess,
  followWriterSuccess,
  followWriterFailure,
  getForgotEmailOTPSuccess,
  getForgotEmailOTPFailure,
  resetPasswordFailure,
  resetPasswordSuccess,
  verifyForgotEmailOTPSuccess,
  verifyForgotEmailOTPFailure,
  logoutFailure,
  logoutSuccess,
  getRefreshTokenFailure,
  getRefreshTokenSuccess,
} from "./signupActions";
function* getEmailOTP(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.data;
    const params = new URLSearchParams({ email: headers });
    // console.log(headers);
    const url = `${baseURL}/${endPoints.sendEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    // console.log(data);
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
    const headers = action.data;
    const params = new URLSearchParams(headers);
    const url = `${baseURL}/${endPoints.verifyEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    // console.log(data);
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

function* sendProfileInfo(action) {
  try {
    // const { headers } = action.payload;
    // console.log(action);
    const headers = action.data;
    // console.log(headers);
    const url = `${baseURL}/${endPoints.createUser}`;
    const data = yield call(postRequest, url, headers);
    // console.log(data);
    // console.log(url);
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

function* checkUsername(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.data;
    const params = new URLSearchParams({ username: headers });
    const url = `${baseURL}/${endPoints.checkUsername}?${params}`;
    // console.log(url);
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

function* getPickFavData(action) {
  try {
    // const { headers } = action.payload;
    const headers = {
      Authorization: action.data.token,
    };
    const url = `${baseURL}/${endPoints.getPickFavData}`;
    const data = yield call(authGetRequest, url, headers);
    if (!data.error) {
      yield put(getPickFavDataSuccess(data));
    } else {
      yield put(getPickFavDataFailure(data.message));
    }
  } catch (err) {
    yield put(getPickFavDataFailure(err.message));
  }
}

export function* getPickFavDataSaga() {
  yield takeLatest(GET_PICK_FAV_DATA_INIT, getPickFavData);
}

function* followWriter(action) {
  try {
    // console.log(action);
    const headers = {
      Authorization: action.data.token,
    };
    const url = `${baseURL}/${endPoints.followMultipleWriters}`;
    const data = yield call(
      authPostRequest,
      url,
      action.data.usernames,
      headers
    );

    if (!data.error) {
      yield put(followWriterSuccess(data));
    } else {
      yield put(followWriterFailure(data.message));
    }
  } catch (err) {
    yield put(followWriterFailure(err.message));
  }
}

export function* followWriterInit() {
  yield takeEvery(FOLLOW_WRITER_INIT, followWriter);
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
    const url = `${baseURL}/${endPoints.refreshToken}`;
    const data = yield call(authPostRequest, url, {}, headers);
    if (!data.error) {
      yield put(getRefreshTokenSuccess(data));
    } else {
      yield put(getRefreshTokenFailure(data.message));
    }
  } catch (err) {
    yield put(getRefreshTokenFailure(err.message));
  }
}

export function* getRefreshTokenSaga() {
  yield takeLatest(GET_REFRESH_TOKEN_INIT, getRefreshToken);
}
