import {
    SEND_PROFILE_INFO_SUCCESS,
    SEND_PROFILE_INFO_FAILURE,
    SEND_PROFILE_INFO_INIT,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_INIT,
    CHECK_USERNAME_SUCCESS,
    CHECK_USERNAME_FAILURE,
    CHECK_USERNAME_INIT,
    GET_OTP_SUCCESS,
    GET_OTP_FAILURE,
    GET_OTP_INIT,
    VERIFY_OTP_SUCCESS,
    VERIFY_OTP_FAILURE,
    VERIFY_OTP_INIT,
    GET_EMAIL_OTP_SUCCESS,
    GET_EMAIL_OTP_FAILURE,
    GET_EMAIL_OTP_INIT,
    VERIFY_EMAIL_OTP_SUCCESS,
    VERIFY_EMAIL_OTP_FAILURE,
    VERIFY_EMAIL_OTP_INIT,
    FORGOT_GET_OTP_SUCCESS,
    FORGOT_GET_OTP_FAILURE,
    FORGOT_GET_OTP_INIT,
    FORGOT_VERIFY_OTP_SUCCESS,
    FORGOT_VERIFY_OTP_FAILURE,
    FORGOT_VERIFY_OTP_INIT,
    FORGOT_GET_EMAIL_OTP_SUCCESS,
    FORGOT_GET_EMAIL_OTP_FAILURE,
    FORGOT_GET_EMAIL_OTP_INIT,
    FORGOT_VERIFY_EMAIL_OTP_SUCCESS,
    FORGOT_VERIFY_EMAIL_OTP_FAILURE,
    FORGOT_VERIFY_EMAIL_OTP_INIT,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    RESET_PASSWORD_INIT,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    LOGOUT_INIT,
    GET_REFRESH_TOKEN_SUCCESS,
    GET_REFRESH_TOKEN_FAILURE,
    GET_REFRESH_TOKEN_INIT,
} from '../../utils/actionTypes';

export const sendProfileInfoSuccess = (data) => {
    return {
        type: SEND_PROFILE_INFO_SUCCESS,
        data,
    };
};

export const sendProfileInfoFailure = (error) => {
    return {
        type: SEND_PROFILE_INFO_FAILURE,
        error,
    };
};

export const sendProfileInfo = (params, headers) => {
    const payload = { params, headers };
    // console.log(payload);
    return {
        type: SEND_PROFILE_INFO_INIT,
        payload,
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
    // console.log(payload);
    return {
        type: LOGIN_INIT,
        payload,
    };
};

export const checkUsernameSuccess = (data) => {
    return {
        type: CHECK_USERNAME_SUCCESS,
        data,
    };
};

export const checkUsernameFailure = (error) => {
    return {
        type: CHECK_USERNAME_FAILURE,
        error,
    };
};

export const checkUsername = (params) => {
    const payload = params;
    return {
        type: CHECK_USERNAME_INIT,
        payload,
    };
};
export const getOTPSuccess = (data) => {
    return {
        type: GET_OTP_SUCCESS,
        data,
    };
};

export const getOTPFailure = (error) => {
    return {
        type: GET_OTP_FAILURE,
        error,
    };
};

export const getOTP = (params) => {
    const payload = params;
    return {
        type: GET_OTP_INIT,
        payload,
    };
};

export const verifyOTPSuccess = (data) => {
    return {
        type: VERIFY_OTP_SUCCESS,
        data,
    };
};

export const verifyOTPFailure = (error) => {
    return {
        type: VERIFY_OTP_FAILURE,
        error,
    };
};

export const verifyOTP = (params) => {
    const payload = params;
    return {
        type: VERIFY_OTP_INIT,
        payload,
    };
};

export const getEmailOTPSuccess = (data) => {
    return {
        type: GET_EMAIL_OTP_SUCCESS,
        data,
    };
};

export const getEmailOTPFailure = (error) => {
    return {
        type: GET_EMAIL_OTP_FAILURE,
        error,
    };
};

export const getEmailOTP = (params) => {
    const payload = params;
    // console.log(payload);
    return {
        type: GET_EMAIL_OTP_INIT,
        payload,
    };
};

export const verifyEmailOTPSuccess = (data) => {
    return {
        type: VERIFY_EMAIL_OTP_SUCCESS,
        data,
    };
};

export const verifyEmailOTPFailure = (error) => {
    return {
        type: VERIFY_EMAIL_OTP_FAILURE,
        error,
    };
};

export const verifyEmailOTP = (params) => {
    const payload = params;
    return {
        type: VERIFY_EMAIL_OTP_INIT,
        payload,
    };
};

export const getForgotOTPSuccess = (data) => {
    return {
        type: FORGOT_GET_OTP_SUCCESS,
        data,
    };
};

export const getForgotOTPFailure = (error) => {
    return {
        type: FORGOT_GET_OTP_FAILURE,
        error,
    };
};

export const getForgotOTP = (params) => {
    const payload = params;
    return {
        type: FORGOT_GET_OTP_INIT,
        payload,
    };
};

export const verifyForgotOTPSuccess = (data) => {
    return {
        type: FORGOT_VERIFY_OTP_SUCCESS,
        data,
    };
};

export const verifyForgotOTPFailure = (error) => {
    return {
        type: FORGOT_VERIFY_OTP_FAILURE,
        error,
    };
};

export const verifyForgotOTP = (params) => {
    const payload = params;
    return {
        type: FORGOT_VERIFY_OTP_INIT,
        payload,
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
    // console.log(payload)
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
    // console.log(params)
    const payload = params;
    return {
        type: RESET_PASSWORD_INIT,
        payload,
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
    // console.log(params)
    const payload = params;
    // console.log(payload, headers);
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
    // console.log(params)
    const payload = { params, headers };
    return {
        type: GET_REFRESH_TOKEN_INIT,
        payload,
    };
};