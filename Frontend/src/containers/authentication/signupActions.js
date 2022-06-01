import {
  GET_EMAIL_OTP_INIT,
  GET_EMAIL_OTP_FAILURE,
  GET_EMAIL_OTP_SUCCESS,
  VERIFY_EMAIL_OTP_SUCCESS,
  VERIFY_EMAIL_OTP_FAILURE,
  VERIFY_EMAIL_OTP_INIT,
  SEND_PROFILE_INFO_INIT,
  SEND_PROFILE_INFO_FAILURE,
  SEND_PROFILE_INFO_SUCCESS,
  CHECK_USERNAME_SUCCESS,
  CHECK_USERNAME_FAILURE,
  CHECK_USERNAME_INIT,
  LOGIN_INIT,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  GET_PICK_FAV_DATA_FAILURE,
  GET_PICK_FAV_DATA_SUCCESS,
  GET_PICK_FAV_DATA_INIT,
  FOLLOW_MULTIPLE_WRITERS_FAILURE,
  FOLLOW_MULTIPLE_WRITERS_SUCCESS,
  FOLLOW_MULTIPLE_WRITERS_INIT,
  FORGOT_GET_EMAIL_OTP_SUCCESS,
  FORGOT_GET_EMAIL_OTP_FAILURE,
  FORGOT_GET_EMAIL_OTP_INIT,
  FORGOT_VERIFY_EMAIL_OTP_SUCCESS,
  FORGOT_VERIFY_EMAIL_OTP_FAILURE,
  FORGOT_VERIFY_EMAIL_OTP_INIT,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_INIT,
  LOGOUT_INIT,
  LOGOUT_FAILURE,
  LOGOUT_SUCCESS,
  GET_REFRESH_TOKEN_FAILURE,
  GET_REFRESH_TOKEN_SUCCESS,
  GET_REFRESH_TOKEN_INIT,
  GOOGLE_SIGN_UP_INIT,
  GOOGLE_SIGN_UP_SUCCESS,
  GOOGLE_SIGN_UP_FAILURE,
  RESET_PASSWORD_STATE,
} from "../../utils/actionTypes";

export function getEmailOTPInit(payload) {
  return {
    type: GET_EMAIL_OTP_INIT,
    data: payload,
  };
}

export function getEmailOTPSuccess(payload) {
  return {
    type: GET_EMAIL_OTP_SUCCESS,
    data: payload,
  };
}

export function getEmailOTPFailure(payload) {
  return {
    type: GET_EMAIL_OTP_FAILURE,
    data: payload,
  };
}

export function verifyEmailOTPInit(payload) {
  return {
    type: VERIFY_EMAIL_OTP_INIT,
    data: payload,
  };
}
export function verifyEmailOTPSuccess(payload) {
  return {
    type: VERIFY_EMAIL_OTP_SUCCESS,
    data: payload,
  };
}
export function verifyEmailOTPFailure(payload) {
  return {
    type: VERIFY_EMAIL_OTP_FAILURE,
    data: payload,
  };
}

export function sendProfileInfoInit(payload) {
  return {
    type: SEND_PROFILE_INFO_INIT,
    data: payload,
  };
}
export function sendProfileInfoFailure(payload) {
  return {
    type: SEND_PROFILE_INFO_FAILURE,
    data: payload,
  };
}
export function sendProfileInfoSuccess(payload) {
  return {
    type: SEND_PROFILE_INFO_SUCCESS,
    data: payload,
  };
}

export const checkUsernameSuccess = (payload) => {
  return {
    type: CHECK_USERNAME_SUCCESS,
    data: payload,
  };
};

export const checkUsernameFailure = (payload) => {
  return {
    type: CHECK_USERNAME_FAILURE,
    data: payload,
  };
};

export const checkUsername = (payload) => {
  return {
    type: CHECK_USERNAME_INIT,
    data: payload,
  };
};

export const loginSuccess = (data) => {
  return {
    type: LOGIN_SUCCESS,
    data,
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    error,
  };
};

export const login = (params) => {
  const payload = { params };
  return {
    type: LOGIN_INIT,
    payload,
  };
};

export const getPickFavDataInit = (data) => {
  return {
    type: GET_PICK_FAV_DATA_INIT,
    data,
  };
};
export const getPickFavDataSuccess = (data) => {
  return {
    type: GET_PICK_FAV_DATA_SUCCESS,
    data,
  };
};
export const getPickFavDataFailure = (data) => {
  return {
    type: GET_PICK_FAV_DATA_FAILURE,
    data,
  };
};

export const followMultipleWritersInit = (data) => {
  return {
    type: FOLLOW_MULTIPLE_WRITERS_INIT,
    data,
  };
};
export const followMultipleWritersFailure = (data) => {
  return {
    type: FOLLOW_MULTIPLE_WRITERS_FAILURE,
    data,
  };
};
export const followMultipleWritersSuccess = (data) => {
  return {
    type: FOLLOW_MULTIPLE_WRITERS_SUCCESS,
    data,
  };
};

export const getForgotEmailOTPSuccess = (data) => {
  return {
    type: FORGOT_GET_EMAIL_OTP_SUCCESS,
    data,
  };
};

export const getForgotEmailOTPFailure = (error) => {
  return {
    type: FORGOT_GET_EMAIL_OTP_FAILURE,
    error,
  };
};

export const getForgotEmailOTP = (params) => {
  const payload = params;
  return {
    type: FORGOT_GET_EMAIL_OTP_INIT,
    payload,
  };
};

export const verifyForgotEmailOTPSuccess = (data) => {
  return {
    type: FORGOT_VERIFY_EMAIL_OTP_SUCCESS,
    data,
  };
};

export const verifyForgotEmailOTPFailure = (error) => {
  return {
    type: FORGOT_VERIFY_EMAIL_OTP_FAILURE,
    error,
  };
};

export const verifyForgotEmailOTP = (params) => {
  const payload = params;
  return {
    type: FORGOT_VERIFY_EMAIL_OTP_INIT,
    payload,
  };
};

export const resetPasswordSuccess = (data) => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    data,
  };
};

export const resetPasswordFailure = (error) => {
  return {
    type: RESET_PASSWORD_FAILURE,
    error,
  };
};

export const resetPassword = (params) => {
  const payload = params;
  return {
    type: RESET_PASSWORD_INIT,
    payload,
  };
};

export const resetPasswordState = (data) => {
  return {
    type: RESET_PASSWORD_STATE,
    payload: data,
  };
};

export const logoutSuccess = (data) => {
  return {
    type: LOGOUT_SUCCESS,
    data,
  };
};

export const logoutFailure = (error) => {
  return {
    type: LOGOUT_FAILURE,
    error,
  };
};

export const logout = (params, headers) => {
  const payload = params;
  return {
    type: LOGOUT_INIT,
    payload,
  };
};

export const getRefreshTokenSuccess = (data) => {
  return {
    type: GET_REFRESH_TOKEN_SUCCESS,
    data,
  };
};

export const getRefreshTokenFailure = (error) => {
  return {
    type: GET_REFRESH_TOKEN_FAILURE,
    error,
  };
};

export const getRefreshToken = (params, headers) => {
  const payload = { params, headers };
  return {
    type: GET_REFRESH_TOKEN_INIT,
    payload,
  };
};

export const signupWithGoogleInit = (data) => {
  return {
    type: GOOGLE_SIGN_UP_INIT,
    payload: data,
  };
};
export const signupWithGoogleSuccess = (data) => {
  return {
    type: GOOGLE_SIGN_UP_SUCCESS,
    payload: data,
  };
};
export const signupWithGoogleFailure = (data) => {
  return {
    type: GOOGLE_SIGN_UP_FAILURE,
    payload: data,
  };
};
