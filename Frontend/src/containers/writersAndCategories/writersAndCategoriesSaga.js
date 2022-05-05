import {
  put, call,
  takeLatest,
} from 'redux-saga/effects';
import { baseURL, endPoints } from '../../utils/apiEndPoints';
import { authGetRequest, getRequest, postRequest } from '../../utils/apiRequests';
import {
  GET_CATEGORIES_WRITERS_INIT,
  GET_STATUS_INIT,
  SEND_SELECTED_INIT,
} from '../../utils/actionTypes';
import {
  getCategoriesWritersSuccess, getCategoriesWritersFailure, sendSelectedSuccess, sendSelectedFailure, getStatusSuccess, getStatusFailure,
} from './writersAndCategoriesActions';

function* getCategoriesWriters(action) {
  try {
    // const { headers } = action.payload;
    const payload = action.payload;
    const headers = {
      "Authorization": payload.headers,
    }
    const url = `${baseURL}/${endPoints.categoriesAndWriters}`;
    const data = yield call(authGetRequest, url, headers);
    if (!data.error) {
      // console.log('1')
      yield put(getCategoriesWritersSuccess(data));
    } else {
      yield put(getCategoriesWritersFailure(data.message));
    }
  } catch (err) {
    // console.log(err);
    yield put(getCategoriesWritersFailure(err.message));
  }
}

export function* getCategoriesWritersSaga() {
  yield takeLatest(GET_CATEGORIES_WRITERS_INIT, getCategoriesWriters);
}

function* getStatus(action) {
  try {
    // const { headers } = action.payload;
    const url = `https://api.binance.com/api/v1/trades?symbol=${action.payload}`;
    const data = yield call(getRequest, url);
    if (!data.error) {
      yield put(getStatusSuccess(data));
    } else {
      yield put(getStatusFailure(data.message));
    }
  } catch (err) {
    yield put(getStatusFailure(err.message));
  }
}

export function* getStatusSaga() {
  yield takeLatest(GET_STATUS_INIT, getStatus);
}

function* sendSelected(action) {
  try {
    // const { headers } = action.payload;
    const headers = action.payload.params;
    // console.log(headers);
    const url = `${baseURL}/${endPoints.updateStatus}`;
    const data = yield call(postRequest, url, headers);
    if (!data.error) {
      yield put(sendSelectedSuccess(data));
    } else {
      yield put(sendSelectedFailure(data.message));
    }
  } catch (err) {
    yield put(sendSelectedFailure(err.message));
  }
}

export function* sendSelectedSaga() {
  yield takeLatest(SEND_SELECTED_INIT, sendSelected);
}