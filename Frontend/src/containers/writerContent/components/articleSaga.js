import { put, call, takeLatest } from "redux-saga/effects";
import { baseURL, endPoints } from "../../../utils/apiEndPoints";
import {
  // getRequest,
  authGetRequest,
  // authPostRequest,
  // authPutRequest,
  authDeleteRequest
} from "../../../utils/apiRequests";
import {
  GET_ARTICLES_INIT,
  // GET_ARTICLES_SUCCESS,
  // GET_ARTICLES_FAILURE,
  DELETE_ARTICLE_INIT
} from "../../../utils/actionTypes";
import {
  getArticlesFailure,
  getArticlesSuccess,
  // deleteArticleInit,
  deleteArticleSuccess,
  deleteArticleFailure
} from "./articleActions";
//
// function onlyUnique(articles) {
//   // console.log(value, index, self);
//   // return self.indexOf(value) === index;
//
//   let res = [];
//
//   for()
// }

export function* getArticlesInit(action) {
  try {
    const { skip, limit, filters, currentArticles } = action.data;
    const headers = {
      Authorization: action.data.authToken
    };
    const params = new URLSearchParams({
      skip: skip,
      limit: limit,
      filters: filters
    });
    const url = `${baseURL}/${endPoints.getAllArticles}?${params}`;
    const res = yield authGetRequest(url, headers);
    let articles = [
      ...currentArticles,
      ...res.articles.filter(article => !article.deleteAt)
    ];

    articles = articles.filter(
      (value, index, self) =>
        index === self.findIndex(t => t.articleId === value.articleId)
    );
    articles = articles.filter(article => !article.deleteAt);

    let btnVisible = true;
    if (articles.length === currentArticles.length) btnVisible = false;
    const data = { articles, btnVisible, filters };
    if (!res.error) {
      yield put(getArticlesSuccess(data));
    } else {
      yield put(getArticlesFailure(res.message));
    }
  } catch (err) {
    yield put(getArticlesFailure(err.message));
  }
}

export function* getArticlesInitSaga(action) {
  yield takeLatest(GET_ARTICLES_INIT, getArticlesInit);
}

export function* deleteArticlesInit(action) {
  try {
    const { token, articleId, filters } = action.data;

    const headers = {
      Authorization: token
    };
    const url = `${baseURL}/${endPoints.deleteArticleComplete}?articleId=${articleId}`;

    const res = yield call(authDeleteRequest, url, headers);
    res.articleId = articleId;
    res.filters = filters;
    if (!res.error) yield put(deleteArticleSuccess(res));
    else yield put(deleteArticleFailure(res.message));
  } catch (err) {
    yield put(deleteArticleFailure(err.message));
  }
}

export function* deleteArticleInitSaga(action) {
  yield takeLatest(DELETE_ARTICLE_INIT, deleteArticlesInit);
}
