import {
  WALLET_ACTIVATE_FAILURE,
  WALLET_ACTIVATE_SUCCESS,
  WALLET_ACTIVATE_INIT,
  WALLET_SEND_OTP_FAILURE,
  WALLET_SEND_OTP_INIT,
  WALLET_SEND_OTP_SUCCESS,
} from "../../utils/actionTypes";

const initial_state = {
  sendOTPinit: false,
  sendOTPSuccess: false,
  sendOTPFailure: false,
  sendOTPData: {},
  activationInit: false,
  activationSuccess: false,
  activationFailure: false,
  activationData: {},
};

const wallet = (state = initial_state, action) => {
  switch (action.type) {
    case WALLET_SEND_OTP_INIT:
      return {
        ...state,
        sendOTPinit: true,
        sendOTPSuccess: false,
        sendOTPFailure: false,
      };
    case WALLET_SEND_OTP_SUCCESS:
      return {
        ...state,
        sendOTPinit: false,
        sendOTPSuccess: true,
        sendOTPFailure: false,
        sendOTPData: action.payload,
      };
    case WALLET_SEND_OTP_FAILURE:
      return {
        ...state,
        sendOTPinit: false,
        sendOTPSuccess: false,
        sendOTPFailure: true,
        sendOTPData: action.payload,
      };
    case WALLET_ACTIVATE_INIT:
      return {
        ...state,
        activationInit: true,
        activationSuccess: false,
        activationFailure: false,
      };
    case WALLET_ACTIVATE_SUCCESS:
      return {
        ...state,
        activationInit: false,
        activationSuccess: true,
        activationFailure: false,
        activationData: action.payload,
      };
    case WALLET_ACTIVATE_FAILURE:
      return {
        ...state,
        activationInit: false,
        activationSuccess: false,
        activationFailure: true,
        activationData: action.payload,
      };
    default:
      return state;
  }
};

export default wallet;
