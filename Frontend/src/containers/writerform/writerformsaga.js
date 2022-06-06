import { put, call, takeLatest } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  // getRequest,
  authGetRequest,
  authPostRequest,
  authPutRequest,
  authDeleteRequest,
} from "../../utils/apiRequests";
import {submitSuccess,submitfailure } from "./writerformaction";
import {
    SUBMIT_INIT
} from "../../utils/actionTypes";

function* postdetails(action) {
   console.log('Saga')
    try {

    const headers ={};
    const url = `${baseURL}/${endPoints.writerdetails}`;
    const data = yield call(authPostRequest, url,action.data.fd, headers);
   console.log(data)
    if (!data.error) {
      yield put(submitSuccess(data.result));
    } else {
      yield put(submitfailure(data.message));
    }
  } catch (err) {
    yield put(submitfailure(err.message));
  }
}

export function* postdetailsSaga() {
   
  yield takeLatest(SUBMIT_INIT, postdetails);
}
