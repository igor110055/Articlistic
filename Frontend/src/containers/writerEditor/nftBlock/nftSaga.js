import {
    put, call,
    takeLatest,
} from 'redux-saga/effects';
import { baseURL, endPoints } from '../../../utils/apiEndPoints';
import { getRequest } from '../../../utils/apiRequests';
import {
    GET_NFT_INIT,
} from '../../../utils/actionTypes';

import {
    getNFTSuccess,
    getNFTFailure
} from './nftActions';

function* getNFT(action) {
    try {
        const url = `https://api.opensea.io/api/v1/asset/${action.data.params}`;
        const data = yield call(getRequest, url);
        if (!data.error) {
            yield put(getNFTSuccess(data));
        } else {
            yield put(getNFTFailure(data.message));
        }
    } catch (err) {
        yield put(getNFTFailure(err.message));
    }
}

export function* getNFTSaga() {
    yield takeLatest(GET_NFT_INIT, getNFT);
}