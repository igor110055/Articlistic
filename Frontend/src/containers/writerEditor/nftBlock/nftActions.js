import {
    GET_NFT_INIT,
    GET_NFT_SUCCESS,
    GET_NFT_FAILURE,
} from './../../../utils/actionTypes';

export const getNFT = (params, headers) => {
    const payload = { params, headers };
    return {
        type: GET_NFT_INIT,
        data: payload,
    }
};

export const getNFTSuccess = (data) => {
    return {
        type: GET_NFT_SUCCESS,
        data,
    }
};

export const getNFTFailure = (error) => {
    return {
        type: GET_NFT_FAILURE,
        error,
    }
};