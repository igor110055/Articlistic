import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  WALLET_SEND_OTP_INIT,
  WALLET_ACTIVATE_INIT,
} from "../../utils/actionTypes";
import {
  walletSendOTPSuccess,
  walletSendOTPFailure,
  walletActivateFailure,
  walletActivateSuccess,
} from "./walletActions";
import { authPostRequest } from "../../utils/apiRequests";
import { put, call, takeLatest } from "redux-saga/effects";

function* walletSendOTP(action) {
  try {
    const headers = {
      Authorization: action.payload.token,
    };
    const url = `${baseURL}/${endPoints.walletSendOTP}`;
    const data = yield call(authPostRequest, url, {}, headers);
    console.log(data);
    if (!data.error) {
      yield put(walletSendOTPSuccess(data));
    } else {
      yield put(walletSendOTPFailure(data.message));
    }
  } catch (err) {
    console.log(err);
  }
}

export function* walletSendOTPSaga() {
  yield takeLatest(WALLET_SEND_OTP_INIT, walletSendOTP);
}

function* walletActivation(action) {
  try {
    const headers = {
      Authorization: action.payload.token,
    };
    const url = `${baseURL}/${endPoints.walletActivate}`;
    const data = yield call(
      authPostRequest,
      url,
      { pin: action.payload.pin, otp: action.payload.otp },
      headers
    );

    console.log(data);
    if (!data.error) {
      yield put(walletActivateSuccess(data));
    } else {
      yield put(walletActivateFailure(data.message));
    }
    yield;
  } catch (err) {
    console.log(err);
  }
}

export function* walletActivationSaga() {
  yield takeLatest(WALLET_ACTIVATE_INIT, walletActivation);
}
