import {
    SEND_PROFILE_INFO_INIT,
    SEND_PROFILE_INFO_SUCCESS,
    SEND_PROFILE_INFO_FAILURE,
    LOGIN_INIT,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    CHECK_USERNAME_INIT,
    CHECK_USERNAME_SUCCESS,
    CHECK_USERNAME_FAILURE,
    GET_OTP_INIT,
    GET_OTP_SUCCESS,
    GET_OTP_FAILURE,
    VERIFY_OTP_INIT,
    VERIFY_OTP_SUCCESS,
    VERIFY_OTP_FAILURE,
    GET_EMAIL_OTP_INIT,
    GET_EMAIL_OTP_SUCCESS,
    GET_EMAIL_OTP_FAILURE,
    VERIFY_EMAIL_OTP_INIT,
    VERIFY_EMAIL_OTP_SUCCESS,
    VERIFY_EMAIL_OTP_FAILURE,
    FORGOT_GET_OTP_INIT,
    FORGOT_GET_OTP_SUCCESS,
    FORGOT_GET_OTP_FAILURE,
    FORGOT_VERIFY_OTP_INIT,
    FORGOT_VERIFY_OTP_SUCCESS,
    FORGOT_VERIFY_OTP_FAILURE,
    FORGOT_GET_EMAIL_OTP_INIT,
    FORGOT_GET_EMAIL_OTP_SUCCESS,
    FORGOT_GET_EMAIL_OTP_FAILURE,
    FORGOT_VERIFY_EMAIL_OTP_INIT,
    FORGOT_VERIFY_EMAIL_OTP_SUCCESS,
    FORGOT_VERIFY_EMAIL_OTP_FAILURE,
    RESET_PASSWORD_INIT,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    LOGOUT_INIT,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    GET_REFRESH_TOKEN_INIT,
    GET_REFRESH_TOKEN_SUCCESS,
    GET_REFRESH_TOKEN_FAILURE,
} from '../utils/actionTypes';


const initialState = {
    isSendingProfileInfo: false,
    sendProfileInfoError: false,
    sendProfileInfoErrorMsg: '',
    sendProfileInfoResp: {},
    isSendingLoginCred: false,
    loginError: false,
    loginErrorMsg: '',
    isLoggedIn: false,
    loginResp: {},
    isCheckingUsername: false,
    checkUsernameError: false,
    checkUsernameErrorMsg: '',
    checkUsernameResp: {},
    isGettingOTP: false,
    getOTPError: false,
    getOTPErrorMsg: '',
    getOTPResp: {},
    isVerifyingOTP: false,
    verifyOTPError: false,
    verifyOTPErrorMsg: '',
    verifyOTPResp: {},
    isGettingEmailOTP: false,
    getEmailOTPError: false,
    getEmailOTPErrorMsg: '',
    getEmailOTPResp: {},
    isVerifyingEmailOTP: false,
    verifyEmailOTPError: false,
    verifyEmailOTPErrorMsg: '',
    verifyEmailOTPResp: {},
    isGettingForgotOTP: false,
    getForgotOTPError: false,
    getForgotOTPErrorMsg: '',
    getForgotOTPResp: {},
    isVerifyingForgotOTP: false,
    verifyForgotOTPError: false,
    verifyForgotOTPErrorMsg: '',
    verifyForgotOTPResp: {},
    isGettingForgotEmailOTP: false,
    getForgotEmailOTPError: false,
    getForgotEmailOTPErrorMsg: '',
    getForgotEmailOTPResp: {},
    isVerifyingForgotEmailOTP: false,
    verifyForgotEmailOTPError: false,
    verifyForgotEmailOTPErrorMsg: '',
    verifyForgotEmailOTPResp: {},
    isResettingPassword: false,
    resetPasswordError: false,
    resetPasswordErrorMsg: '',
    resetPasswordResp: {},
    isLoggingOut: false,
    logoutError: false,
    logoutErrorMsg: '',
    logoutResp: {},
    isGettingRefreshToken: false,
    getRefreshTokenError: false,
    getRefreshTokenErrorMsg: '',
    getRefreshTokenResp: {},
};

const loginSignup = (state = initialState, action) => {
    switch (action.type) {

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
            };
        }

        case SEND_PROFILE_INFO_FAILURE:
            return {
                ...state,
                isSendingProfileInfo: false,
                sendProfileInfoError: true,
                sendProfileInfoErrorMsg: action.error,
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
                isLoggedIn: true,
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
            };
        }

        case CHECK_USERNAME_FAILURE:
            return {
                ...state,
                isCheckingUsername: false,
                checkUsernameError: true,
                checkUsernameErrorMsg: action.error,
            };

        case GET_OTP_INIT:
            return {
                ...state,
                isGettingOTP: true,
                getOTPError: false,
            };

        case GET_OTP_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingOTP: false,
                getOTPResp: data,
            };
        }

        case GET_OTP_FAILURE:
            return {
                ...state,
                isGettingOTP: false,
                getOTPError: true,
                getOTPErrorMsg: action.error,
            };

        case VERIFY_OTP_INIT:
            return {
                ...state,
                isVerifyingOTP: true,
                verifyOTPError: false,
            };

        case VERIFY_OTP_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isVerifyingOTP: false,
                verifyOTPResp: data,
            };
        }

        case VERIFY_OTP_FAILURE:
            return {
                ...state,
                isVerifyingOTP: false,
                verifyOTPError: true,
                verifyOTPErrorMsg: action.error,
            };

        case GET_EMAIL_OTP_INIT:
            return {
                ...state,
                isGettingEmailOTP: true,
                getEmailOTPError: false,
            };

        case GET_EMAIL_OTP_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingEmailOTP: false,
                getEmailOTPResp: data,
            };
        }

        case GET_EMAIL_OTP_FAILURE:
            return {
                ...state,
                isGettingEmailOTP: false,
                getEmailOTPError: true,
                getEmailOTPErrorMsg: action.error,
            };

        case VERIFY_EMAIL_OTP_INIT:
            return {
                ...state,
                isVerifyingEmailOTP: true,
                verifyEmailOTPError: false,
            };

        case VERIFY_EMAIL_OTP_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isVerifyingEmailOTP: false,
                verifyEmailOTPResp: data,
            };
        }

        case VERIFY_EMAIL_OTP_FAILURE:
            return {
                ...state,
                isVerifyingEmailOTP: false,
                verifyEmailOTPError: true,
                verifyEmailOTPErrorMsg: action.error,
            };

        case FORGOT_GET_OTP_INIT:
            return {
                ...state,
                isGettingForgotOTP: true,
                getForgotOTPError: false,
            };

        case FORGOT_GET_OTP_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingForgotOTP: false,
                getForgotOTPResp: data,
            };
        }

        case FORGOT_GET_OTP_FAILURE:
            return {
                ...state,
                isGettingForgotOTP: false,
                getForgotOTPError: true,
                getForgotOTPErrorMsg: action.message,
            };

        case FORGOT_VERIFY_OTP_INIT:
            return {
                ...state,
                isVerifyingForgotOTP: true,
                verifyForgotOTPError: false,
            };

        case FORGOT_VERIFY_OTP_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isVerifyingForgotOTP: false,
                verifyForgotOTPResp: data,
            };
        }

        case FORGOT_VERIFY_OTP_FAILURE:
            return {
                ...state,
                isVerifyingForgotOTP: false,
                verifyForgotOTPError: true,
                verifyForgotOTPErrorMsg: action.error,
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

        case LOGOUT_INIT:
            return {
                ...state,
                isLoggingOut: true,
                logoutError: false,
            };

        case LOGOUT_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isLoggingOut: false,
                logoutResp: data,
            };
        }

        case LOGOUT_FAILURE:
            return {
                ...state,
                isLoggingOut: false,
                logoutError: true,
                logoutErrorMsg: action.error,
            };

        case GET_REFRESH_TOKEN_INIT:
            return {
                ...state,
                isGettingRefreshToken: true,
                getRefreshTokenError: false,
            };

        case GET_REFRESH_TOKEN_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingRefreshToken: false,
                getRefreshTokenResp: data,
            };
        }

        case GET_REFRESH_TOKEN_FAILURE:
            return {
                ...state,
                isGettingRefreshToken: false,
                getRefreshTokenError: true,
                getRefreshTokenErrorMsg: action.error,
            };


        default:
            return state;
    }
};

export default loginSignup;
