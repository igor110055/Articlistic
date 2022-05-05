import {
    GET_NFT_INIT,
    GET_NFT_SUCCESS,
    GET_NFT_FAILURE,
} from '../../../utils/actionTypes';


const initialState = {
    isGettingNFT: false,
    getNFTError: false,
    getNFTErrorMsg: '',
    getNFTResp: {},
};

const nft = (state = initialState, action) => {
    switch (action.type) {
        case GET_NFT_INIT:
            return {
                ...state,
                isGettingNFT: true,
                getNFTError: false,
            };

        case GET_NFT_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingNFT: false,
                getNFTResp: data,
            };
        }

        case GET_NFT_FAILURE:
            return {
                ...state,
                isGettingNFT: false,
                getNFTError: true,
                getNFTErrorMsg: action.error,
            };

        default:
            return state;
    }
};

export default nft;
