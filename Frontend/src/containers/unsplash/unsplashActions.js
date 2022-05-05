import {
    GET_UNSPLASH_INIT,
    GET_UNSPLASH_SUCCESS,
    GET_UNSPLASH_FAILURE,
} from './../../utils/actionTypes';

export const getUnsplash = (params, headers) => {
    const payload = { params, headers };
    return {
        type: GET_UNSPLASH_INIT,
        data: payload,
    }
};

export const getUnsplashSuccess = (data) => {
    return {
        type: GET_UNSPLASH_SUCCESS,
        data,
    }
};

export const getUnsplashFailure = (error) => {
    return {
        type: GET_UNSPLASH_FAILURE,
        error,
    }
};