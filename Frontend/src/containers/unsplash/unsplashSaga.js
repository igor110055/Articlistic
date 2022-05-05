import {
    put, call,
    takeLatest,
} from 'redux-saga/effects';
import { baseURL, endPoints } from '../../utils/apiEndPoints';
import { getRequest } from '../../utils/apiRequests';
import {
    GET_UNSPLASH_INIT,
} from '../../utils/actionTypes';

import {
    getUnsplashSuccess,
    getUnsplashFailure
} from './unsplashActions';

function* getUnsplash(action) {
    try {
        const payload = action.data.params;
        const url = `https://api.unsplash.com/search/photos?page=1&client_id=6q218GWJ_v9YTd3O7njaaLdzC4WvPffU-9J1jQErXhg&query=${payload}&per_page=1000`;
        const data = yield call(getRequest, url);
        if (!data.error) {
            yield put(getUnsplashSuccess(data));
        } else {
            yield put(getUnsplashFailure(data.message));
        }
    } catch (err) {
        yield put(getUnsplashFailure(err.message));
    }
}

export function* getUnsplashSaga() {
    yield takeLatest(GET_UNSPLASH_INIT, getUnsplash);
}