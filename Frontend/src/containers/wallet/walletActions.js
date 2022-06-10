import {
  WALLET_ACTIVATE_FAILURE,
  WALLET_ACTIVATE_SUCCESS,
  WALLET_ACTIVATE_INIT,
  WALLET_SEND_OTP_FAILURE,
  WALLET_SEND_OTP_INIT,
  WALLET_SEND_OTP_SUCCESS,
} from "../../utils/actionTypes";

export function walletSendOTPInit(data) {
  return {
    type: WALLET_SEND_OTP_INIT,
    payload: data,
  };
}
export function walletSendOTPSuccess(data) {
  return {
    type: WALLET_SEND_OTP_SUCCESS,
    payload: data,
  };
}
export function walletSendOTPFailure(data) {
  return {
    type: WALLET_SEND_OTP_FAILURE,
    payload: data,
  };
}
export function walletActivateInit(data) {
  return {
    type: WALLET_ACTIVATE_INIT,
    payload: data,
  };
}
export function walletActivateFailure(data) {
  return {
    type: WALLET_ACTIVATE_FAILURE,
    payload: data,
  };
}
export function walletActivateSuccess(data) {
  return {
    type: WALLET_ACTIVATE_SUCCESS,
    payload: data,
  };
}
