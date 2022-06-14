import { put, call, takeEvery } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import { authGetRequest } from "../../utils/apiRequests";

import { GET_STORY_INIT } from "../../utils/actionTypes";

import {
  getStoryInit,
  getStoryFailure,
  getStorySuccess,
} from "./storyActions.js";

function* getStory(action) {
  try {
    const { token, articleId } = action.data;
    const headers = {
      Authorization: token,
    };
    const url = `${baseURL}/${endPoints.getArticle}?articleId=${articleId}`;
    const res = yield call(authGetRequest, url, headers);

    console.log(res);
    if (!res.error) yield put(getStorySuccess(res.article));
    else yield put(getStoryFailure(res.message));
  } catch (err) {
    yield put(getStoryFailure(err.message));
  }
}
export function* getStorySaga(action) {
  yield takeEvery(GET_STORY_INIT, getStory);
}
