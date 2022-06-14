import { put, call, takeLatest, takeEvery } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import { authGetRequest } from "../../utils/apiRequests";
import {
  getWritersSuccess,
  getWritersFailure,
  getArticlesForPublicationSuccess,
  getArticlesForPublicationFailure,
  getLatestArticlesForWriterSuccess,
  getLatestArticlesForWriterFailure,
} from "./homepageAction";
import {
  GET_HOME_PAGE_DATA_INIT,
  GET_ARTICLES_FOR_PUBLICATION_INIT,
  GET_LATEST_ARTICLES_FOR_WRITER_INIT,
} from "../../utils/actionTypes";

function* getWritersAndArticles(action) {
  try {
    const headers = {
      Authorization: action.data.token,
    };

    const url = `${baseURL}/${endPoints.userHomePageGet}`;
    var data = yield call(authGetRequest, url, headers);
    // console.log(data);
    if (!data.error) {
      yield put(getWritersSuccess(data.result));
    } else {
      yield put(getWritersFailure(data.message));
    }
  } catch (err) {
    yield put(getWritersFailure(err.message));
  }
}

export function* getWriterandArticlesSaga() {
  yield takeLatest(GET_HOME_PAGE_DATA_INIT, getWritersAndArticles);
}

function* getArticleForPublication(action) {
  try {
    const headers = {
      Authorization: action.data.token,
    };

    const url = `${baseURL}/${
      endPoints.getArticlesForPublication
    }?publicationId=${action.data.publicationId}&skip=${0}&limit=${4}`;

    var data = yield call(authGetRequest, url, headers);

    const response = { ...data, writer: action.data.writer };

    // console.log(data);
    if (!data.error) yield put(getArticlesForPublicationSuccess(response));
    else yield put(getArticlesForPublicationFailure(data.message));
  } catch (e) {
    console.log(e);
  }
}

export function* getArticleForPublicationSaga() {
  yield takeLatest(GET_ARTICLES_FOR_PUBLICATION_INIT, getArticleForPublication);
}

function* getLatestArticlesForWriter(action) {
  try {
    const headers = {
      Authorization: action.data.token,
    };
    const url = `${baseURL}/${endPoints.getLatestForWriter}?username=${
      action.data.writer
    }&skip=${0}&limit=${4}`;

    var data = yield call(authGetRequest, url, headers);
    const response = {
      articles: data.articles.articles,
      writer: action.data.writer,
    };

    if (!data.error) yield put(getLatestArticlesForWriterSuccess(response));
    else yield put(getLatestArticlesForWriterFailure(data.message));
  } catch (e) {
    console.log(e);
  }
}

export function* getLatestArticlesForWriterSaga() {
  yield takeEvery(
    GET_LATEST_ARTICLES_FOR_WRITER_INIT,
    getLatestArticlesForWriter
  );
}
