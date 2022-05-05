import {
    GET_UNSPLASH_INIT,
    GET_UNSPLASH_SUCCESS,
    GET_UNSPLASH_FAILURE,
} from '../../utils/actionTypes';


const initialState = {
    isGettingUnsplash: false,
    getUnsplashError: false,
    getUnsplashErrorMsg: '',
    getUnsplashResp: [],
};

const unsplash = (state = initialState, action) => {
    switch (action.type) {
        case GET_UNSPLASH_INIT:
            return {
                ...state,
                isGettingUnsplash: true,
                getUnsplashError: false,
            };

        case GET_UNSPLASH_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingUnsplash: false,
                getUnsplashResp: data,
            };
        }

        case GET_UNSPLASH_FAILURE:
            return {
                ...state,
                isGettingUnsplash: false,
                getUnsplashError: true,
                getUnsplashErrorMsg: action.error,
            };

        default:
            return state;
    }
};

export default unsplash;
