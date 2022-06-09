import {
    put, call,
    takeLatest,
} from 'redux-saga/effects';
import { baseURL, endPoints } from '../../utils/apiEndPoints';
import { putRequest, authPostRequest, authPutRequest, authGetRequest } from '../../utils/apiRequests';
import {
    UPLOAD_IMAGE_INIT,
    CREATE_NEW_ARTICLE_INIT,
    UPLOAD_ARTICLE_INIT,
    GET_ARTICLE_INIT,
    GET_ALL_ARTICLES_INIT,
    DISCARD_ARTICLE_INIT,
} from '../../utils/actionTypes';

import {
    uploadImageSuccess,
    uploadImageFailure,
    createNewArticleSuccess,
    createNewArticleFailure,
    uploadArticleSuccess,
    uploadArticleFailure,
    getArticleSuccess,
    getArticleFailure,
    getAllArticlesSuccess,
    getAllArticlesFailure,
    discardArticleSuccess,
    discardArticleFailure,
} from './writerEditorActions';

function* uploadImage(action) {
    try {
        const payload = action.payload;
        const headers = {
            "Authorization": payload.headers,
        }
        const url = `${baseURL}/${endPoints.uploadImage}`;
        const data = yield call(putRequest, url, headers);
        if (!data.error) {
            yield put(uploadImageSuccess(data));
        } else {
            yield put(uploadImageFailure(data.message));
        }
    } catch (err) {
        yield put(uploadImageFailure(err.message));
    }
}

export function* uploadImageSaga() {
    yield takeLatest(UPLOAD_IMAGE_INIT, uploadImage);
}

function* createNewArticle(action) {
    console.log(action);
    try {
        const params = new URLSearchParams({
            username: action.data.params,
        })
        const headers = {
            "Authorization": action.data.headers,
        }
        const url = `${baseURL}/${endPoints.createNewArticle}?${params}`;
        // console.log(url);
        const data = yield call(authPostRequest, url, {}, headers);
        console.log(data)
        if (!data.error) {
            yield put(createNewArticleSuccess(data));
        } else {
            yield put(createNewArticleFailure(data.message));
        }
    } catch (err) {
        yield put(createNewArticleFailure(err.message));
    }
}

export function* createNewArticleSaga() {
    yield takeLatest(CREATE_NEW_ARTICLE_INIT, createNewArticle);
}

function* uploadArticle(action) {
    // console.log(action.data.params.qparams);
    try {
        const payload = action.data.params.main || {};
        // console.log(action.data);
        const params = new URLSearchParams(action.data.params.qParams);
        // console.log(params);
        const headers = {
            "Authorization": action.data.headers,
        }
        // console.log(payload, params, headers);
        let url = `${baseURL}/${endPoints.uploadArticle}`;
        if (action.data.params.qParams !== undefined) {
            url = `${baseURL}/${endPoints.uploadArticle}?${params}`;
        }
        // console.log(headers);
        const data = yield call(authPutRequest, url, payload, headers);
        if (!data.error) {
            // console.log(data);
            yield put(uploadArticleSuccess(data));
        } else {
            yield put(uploadArticleFailure(data.message));
        }
    } catch (err) {
        yield put(uploadArticleFailure(err.message));
    }
}

export function* uploadArticleSaga() {
    yield takeLatest(UPLOAD_ARTICLE_INIT, uploadArticle);
}

function* getArticle(action) {
    // console.log(action);
    try {
        const params = new URLSearchParams(action.data.params);
        const headers = {
            "Authorization": action.data.headers,
        }
        const url = `${baseURL}/${endPoints.getArticle}?${params}`;
        const data = yield call(authGetRequest, url, headers);
        if (!data.error) {
            yield put(getArticleSuccess(data));
        } else {
            yield put(getArticleFailure(data.message));
        }
    } catch (err) {
        yield put(getArticleFailure(err.message));
    }
}

export function* getArticleSaga() {
    yield takeLatest(GET_ARTICLE_INIT, getArticle);
}

function* getAllArticles(action) {
    // console.log(action);
    try {
        const params = new URLSearchParams(action.data.params);
        const headers = {
            "Authorization": action.data.headers,
        }
        // console.log(headers);
        const url = `${baseURL}/${endPoints.getAllArticles}?${params}`;
        const data = yield call(authGetRequest, url, headers);
        if (!data.error) {
            yield put(getAllArticlesSuccess(data));
        } else {
            yield put(getAllArticlesFailure(data.message));
        }
    } catch (err) {
        yield put(getAllArticlesFailure(err.message));
    }
}

export function* getAllArticlesSaga() {
    yield takeLatest(GET_ALL_ARTICLES_INIT, getAllArticles);
}

function* discardArticle(action) {
    // console.log(action);
    try {
        const params = new URLSearchParams(action.data.params);
        const headers = {
            "Authorization": action.data.headers,
        }
        // console.log(headers);
        const url = `${baseURL}/${endPoints.deleteArticle}?${params}`;
        const data = yield call(authPostRequest, url, {}, headers);
        if (!data.error) {
            yield put(discardArticleSuccess(data));
        } else {
            yield put(discardArticleFailure(data.message));
        }
    } catch (err) {
        yield put(discardArticleFailure(err.message));
    }
}

export function* discardArticleSaga() {
    yield takeLatest(DISCARD_ARTICLE_INIT, discardArticle);
}