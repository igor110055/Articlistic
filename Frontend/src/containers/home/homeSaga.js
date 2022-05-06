import {
    put, call,
    takeLatest,
} from 'redux-saga/effects';
import { baseURL, endPoints } from '../../utils/apiEndPoints';
import {  authGetRequest, authPostRequest } from '../../utils/apiRequests';
import {
    GET_FOLLOWED_WRITERS_INIT,
    BOOKMARK_ARTICLE_INIT,
} from '../../utils/actionTypes';

import {
    getFollowedWritersSuccess,
    getFollowedWritersFailure,
    bookmarkArticleSuccess,
    bookmarkArticleFailure,
} from './homeActions';

function* getFollowedWriters(action) {
    // console.log(action);
    try {
        // const payload = action.data.params;
        const headers = {
            "Authorization": action.data.headers
        }
        const url = `${baseURL}/${endPoints.userHomePageGet}`;
        const data = yield call(authGetRequest, url, headers);
        if (!data.error) {
            yield put(getFollowedWritersSuccess(data));
        } else {
            yield put(getFollowedWritersFailure(data.message));
        }
    } catch (err) {
        yield put(getFollowedWritersFailure(err.message));
    }
}

export function* getFollowedWritersSaga() {
    yield takeLatest(GET_FOLLOWED_WRITERS_INIT, getFollowedWriters);
}

function* bookmarkArticle(action) {
    // console.log(action);
    try {
        const payload = action.data.params;
        // console.log(payload);
        const params = new URLSearchParams(payload);
        const headers = {
            "Authorization": action.data.headers,
        }
        const url = `${baseURL}/${endPoints.bookmarkArticle}?${params}`;
        const data = yield call(authPostRequest, url, {}, headers);
        // console.log(data);
        if (!data.error) {
            yield put(bookmarkArticleSuccess(data));
        } else {
            yield put(bookmarkArticleFailure(data.message));
        }
    } catch (err) {
        yield put(bookmarkArticleFailure(err.message));
    }
}

export function* bookmarkArticleSaga() {
    yield takeLatest(BOOKMARK_ARTICLE_INIT, bookmarkArticle);
}