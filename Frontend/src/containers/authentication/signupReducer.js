import {
  GET_EMAIL_OTP_INIT,
  GET_EMAIL_OTP_SUCCESS,
  GET_EMAIL_OTP_FAILURE,
  VERIFY_EMAIL_OTP_INIT,
  VERIFY_EMAIL_OTP_FAILURE,
  VERIFY_EMAIL_OTP_SUCCESS,
  SEND_PROFILE_INFO_INIT,
  SEND_PROFILE_INFO_FAILURE,
  SEND_PROFILE_INFO_SUCCESS,
  CHECK_USERNAME_FAILURE,
  CHECK_USERNAME_INIT,
  CHECK_USERNAME_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_INIT,
  LOGIN_FAILURE,
  GET_PICK_FAV_DATA_FAILURE,
  GET_PICK_FAV_DATA_SUCCESS,
  GET_PICK_FAV_DATA_INIT,
  FORGOT_GET_EMAIL_OTP_SUCCESS,
  FORGOT_GET_EMAIL_OTP_FAILURE,
  FORGOT_GET_EMAIL_OTP_INIT,
  FORGOT_VERIFY_EMAIL_OTP_SUCCESS,
  FORGOT_VERIFY_EMAIL_OTP_FAILURE,
  FORGOT_VERIFY_EMAIL_OTP_INIT,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_INIT,
} from "../../utils/actionTypes";

const initialState = {
  isGettingEmailOTP: false,
  getEmailOTPError: false,
  getEmailOTPErrorMsg: "",
  getEmailOTPResp: {},
  getEmailOTPSuccess: false,

  isVerifyingEmailOTP: false,
  verifyEmailOTPError: false,
  verifyEmailOTPErrorMsg: "",
  verifyEmailOTPResp: {},
  emailOTPVerified: false,

  isSendingProfileInfo: false,
  sendProfileInfoError: false,
  sendProfileInfoErrorMsg: "",
  sendProfileInfoResp: {},
  profileInfoSuccess: false,

  checkUsernameError: false,
  checkUsernameErrorMsg: "",
  checkUsernameResp: {},
  validUsername: false,

  isSendingLoginCred: false,
  loginError: false,
  loginErrorMsg: "",
  isLoggedIn: false,
  loginResp: {},

  pickFavWritersData: [],
  isGettingPickFavWritersData: false,
  pickFavWritersDataError: false,
  // pickFavWritersDataSuccess: false,

  isGettingForgotEmailOTP: false,
  getForgotEmailOTPError: false,
  getForgotEmailOTPErrorMsg: "",
  getForgotEmailOTPResp: {},
  getForgotEmailSuccess: false,

  isVerifyingForgotEmailOTP: false,
  verifyForgotEmailOTPError: false,
  verifyForgotEmailOTPErrorMsg: "",
  verifyForgotEmailOTPResp: {},
  verifyForgotEmailOTPSuccess: false,

  isResettingPassword: false,
  resetPasswordError: false,
  resetPasswordErrorMsg: "",
  resetPasswordResp: {},
};

const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EMAIL_OTP_INIT:
      return {
        ...state,
        isGettingEmailOTP: true,
        getEmailOTPError: false,
        getEmailOTPSuccess: false,
      };

    case GET_EMAIL_OTP_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isGettingEmailOTP: false,
        getEmailOTPResp: data,
        emailOTPVerified: false,
        getEmailOTPSuccess: true,
      };
    }

    case GET_EMAIL_OTP_FAILURE:
      return {
        ...state,
        isGettingEmailOTP: false,
        getEmailOTPError: true,
        getEmailOTPErrorMsg: action.error,
        emailOTPVerified: false,
        getEmailOTPSuccess: false,
      };

    case VERIFY_EMAIL_OTP_INIT:
      return {
        ...state,
        isVerifyingEmailOTP: true,
        verifyEmailOTPError: false,
        // emailOTPVerified: false,
      };

    case VERIFY_EMAIL_OTP_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isVerifyingEmailOTP: false,
        verifyEmailOTPResp: data,
        emailOTPVerified: true,
      };
    }

    case VERIFY_EMAIL_OTP_FAILURE:
      return {
        ...state,
        isVerifyingEmailOTP: false,
        verifyEmailOTPError: true,
        verifyEmailOTPErrorMsg: action.error,
        emailOTPVerified: false,
      };

    case SEND_PROFILE_INFO_INIT:
      return {
        ...state,
        isSendingProfileInfo: true,
        sendProfileInfoError: false,
      };

    case SEND_PROFILE_INFO_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isSendingProfileInfo: false,
        sendProfileInfoResp: data,
        profileInfoSuccess: true,
      };
    }

    case SEND_PROFILE_INFO_FAILURE:
      return {
        ...state,
        isSendingProfileInfo: false,
        sendProfileInfoError: true,
        sendProfileInfoErrorMsg: action.error,
      };
    case CHECK_USERNAME_INIT:
      return {
        ...state,
        isCheckingUsername: true,
        checkUsernameError: false,
      };

    case CHECK_USERNAME_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isCheckingUsername: false,
        checkUsernameResp: data,
        validUsername: true,
      };
    }

    case CHECK_USERNAME_FAILURE:
      return {
        ...state,
        isCheckingUsername: false,
        checkUsernameError: true,
        checkUsernameErrorMsg: action.error,
        validUsername: false,
      };

    case LOGIN_INIT:
      return {
        ...state,
        isSendingLoginCred: true,
        loginError: false,
      };

    case LOGIN_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isSendingLoginCred: false,
        loginResp: data,
        isLoggedIn: true,
      };
    }

    case LOGIN_FAILURE:
      return {
        ...state,
        isSendingLoginCred: false,
        loginError: true,
        loginErrorMsg: action.error,
        isLoggedIn: false,
      };
    case GET_PICK_FAV_DATA_INIT:
      return {
        ...state,
        isGettingPickFavWritersData: true,
        pickFavWritersDataError: false,
        // pickFavWritersDataSuccess: false,
      };
    case GET_PICK_FAV_DATA_SUCCESS:
      return {
        ...state,
        isGettingPickFavWritersData: false,
        pickFavWritersDataError: false,
        // pickFavWritersDataSuccess: true,
        pickFavWritersData: action.data.writers,
      };
    case GET_PICK_FAV_DATA_FAILURE:
      return {
        ...state,
        isGettingPickFavWritersData: false,
        pickFavWritersDataError: true,
        // pickFavWritersDataSuccess: false,
        pickFavWritersData: {},
      };
    case FORGOT_GET_EMAIL_OTP_INIT:
      return {
        ...state,
        isGettingForgotEmailOTP: true,
        getForgotEmailOTPError: false,
      };

    case FORGOT_GET_EMAIL_OTP_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isGettingForgotEmailOTP: false,
        getForgotEmailOTPResp: data,
        getForgotEmailSuccess: true,
      };
    }

    case FORGOT_GET_EMAIL_OTP_FAILURE:
      return {
        ...state,
        isGettingForgotEmailOTP: false,
        getForgotEmailOTPError: true,
        getForgotEmailOTPErrorMsg: action.message,
      };

    case FORGOT_VERIFY_EMAIL_OTP_INIT:
      return {
        ...state,
        isVerifyingForgotEmailOTP: true,
        verifyForgotEmailOTPError: false,
      };

    case FORGOT_VERIFY_EMAIL_OTP_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isVerifyingForgotEmailOTP: false,
        verifyForgotEmailOTPResp: data,
        verifyForgotEmailOTPSuccess: true,
      };
    }

    case FORGOT_VERIFY_EMAIL_OTP_FAILURE:
      return {
        ...state,
        isVerifyingForgotEmailOTP: false,
        verifyForgotEmailOTPError: true,
        verifyForgotEmailOTPErrorMsg: action.error,
      };

    case RESET_PASSWORD_INIT:
      return {
        ...state,
        isResettingPassword: true,
        resetPasswordError: false,
      };

    case RESET_PASSWORD_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isResettingPassword: false,
        resetPasswordResp: data,
      };
    }

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isResettingPassword: false,
        resetPasswordError: true,
        resetPasswordErrorMsg: action.error,
      };

    default:
      return state;
  }
};

export default signupReducer;
