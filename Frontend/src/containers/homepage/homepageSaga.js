import { put, call, takeLatest } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  // getRequest,
  authGetRequest,
  authPostRequest,
  authPutRequest,
  authDeleteRequest,
} from "../../utils/apiRequests";
import { getWritersSuccess, getWritersFailure } from "./homepageAction";
import {
  GET_HOME_PAGE_DATA_INIT,
  GET_HOME_PAGE_DATA_FAILURE,
  GET_HOME_PAGE_DATA_SUCCESS,
} from "../../utils/actionTypes";

function* getWritersAndArticles(action) {
   console.log('Saga')
    try {
    const headers = {
      Authorization: action.data.token,
    };

    const url = `${baseURL}/${endPoints.userHomePageGet}`;
    const data = yield call(authGetRequest, url, headers);
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
