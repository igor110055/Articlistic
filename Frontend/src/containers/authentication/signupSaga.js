import {
  GET_EMAIL_OTP_INIT,
  VERIFY_EMAIL_OTP_INIT,
  SEND_PROFILE_INFO_INIT,
  CHECK_USERNAME_INIT,
  LOGIN_INIT,
  GET_PICK_FAV_DATA_INIT,
  FOLLOW_MULTIPLE_WRITERS_INIT,
  RESET_PASSWORD_INIT,
  FORGOT_VERIFY_EMAIL_OTP_INIT,
  FORGOT_GET_EMAIL_OTP_INIT,
  LOGOUT_INIT,
  GET_REFRESH_TOKEN_INIT,
  GOOGLE_SIGN_UP_INIT,
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
  followMultipleWritersSuccess,
  followMultipleWritersFailure,
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
  signupWithGoogleSuccess,
  signinWithGoogleSuccess,
  signupWithGoogleFailure,
  // followultipleWritersFailure,
} from "./signupActions";
function* getEmailOTP(action) {
  try {
    const headers = action.data;
    const params = new URLSearchParams({ email: headers });
    const url = `${baseURL}/${endPoints.sendEmailOTP}?${params}`;

    const data = yield call(postRequest, url);
    if (!data.error) {
      yield put(getEmailOTPSuccess(data));
    } else {
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
    const headers = action.data;
    const params = new URLSearchParams(headers);
    const url = `${baseURL}/${endPoints.verifyEmailOTP}?${params}`;

    const data = yield call(postRequest, url);
    if (!data.error) {
      yield put(verifyEmailOTPSuccess(data));
    } else {
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
    const headers = action.data;
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

function* checkUsername(action) {
  try {
    const headers = action.data;
    const params = new URLSearchParams({ username: headers });
    const url = `${baseURL}/${endPoints.checkUsername}?${params}`;
    const data = yield call(getRequest, url);
    if (!data.error) {
      yield put(checkUsernameSuccess(data));
    } else {
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
    const url = `${baseURL}/${endPoints.login}`;
    const data = yield call(postRequest, url, headers);

    if (!data.error && !data.status) {
      yield put(loginSuccess(data));
      localStorage.setItem("isWriter", data.isWriter);
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

function* followMultipleWriters(action) {
  try {
    const headers = {
      Authorization: action.data.token,
    };
    const url = `${baseURL}/${endPoints.followMultipleWriters}`;
    const data = yield call(authPostRequest, url, action.data, headers);

    if (!data.error) {
      yield put(followMultipleWritersSuccess(data));
    } else {
      yield put(followMultipleWritersFailure(data.message));
    }
  } catch (err) {
    yield put(followMultipleWritersFailure(err.message));
  }
}

export function* followWriterInit() {
  yield takeEvery(FOLLOW_MULTIPLE_WRITERS_INIT, followMultipleWriters);
}

function* getForgotEmailOTP(action) {
  try {
    const headers = action.payload;
    const params = new URLSearchParams({ email: headers });
    const url = `${baseURL}/${endPoints.forgotSendEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    data.message = `A user with this email does not exist.`;
    if (!data.error) {
      yield put(getForgotEmailOTPSuccess(data));
    } else {
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
    const headers = action.payload;
    const params = new URLSearchParams(headers);
    const url = `${baseURL}/${endPoints.forgotVerifyEmailOTP}?${params}`;
    const data = yield call(postRequest, url);
    if (!data.error) {
      yield put(verifyForgotEmailOTPSuccess(data));
    } else {
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
    const headers = action.payload;
    const url = `${baseURL}/${endPoints.resetPassword}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(resetPasswordSuccess(data));
    } else {
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
    const payload = action.payload;
    const headers = {
      Authorization: payload.accessToken,
    };
    const url = `${baseURL}/${endPoints.logout}`;
    const data = yield call(authPostRequest, url, payload, headers);
    if (!data.error) {
      yield put(logoutSuccess(data));
    } else {
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

export function* googleSignup(action) {
  try {
    const tokenId = action.payload;
    const url = `${baseURL}/${endPoints.googleSignup}?token=${tokenId}`;
    const data = yield call(postRequest, url, {}, {});

    if (data.error) {
      yield put(signupWithGoogleFailure(data.message));
    } else {
      if (data.accessToken) {
        localStorage.setItem("isWriter", data.isWriter);
        Cookie.set("refreshToken", data.refreshToken, { expires: 30 });
        Cookie.set("accessToken", data.accessToken, { expires: 7 });
        Cookie.set("oneDayBeforeAccessToken", true, { expires: 6 });
        yield put(signinWithGoogleSuccess(data));
      } else {
        yield put(signupWithGoogleSuccess(data));
      }
    }
  } catch (e) {
    yield put(signupWithGoogleFailure(e.message));
  }
}

export function* googleSignupSaga() {
  yield takeLatest(GOOGLE_SIGN_UP_INIT, googleSignup);
}
