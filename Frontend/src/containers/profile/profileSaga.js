import { put, call, takeLatest } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  // getRequest,
  authGetRequest,
  authPostRequest,
  authPutRequest,
  authDeleteRequest,
} from "../../utils/apiRequests";

import AlexTanario from "../../Images/users/AlexTenario.png";
import { getuserSuccess, getuserFailure,getArticlessuccess } from "./profileAction";
import {
  GET_USER_DATA_INIT,
  GET_USER_DATA_FAILURE,
  GET_USER_DATA_SUCCESS,GET_ARTICLES_INIT
} from "../../utils/actionTypes";

export function* getArticlesInit(action) {
  try {
    const { skip, limit, filters, currentArticles } = action.data;
    const headers = {
      Authorization: action.data.authToken,
    };
    console.log('data')
    const params = new URLSearchParams({
      skip: skip,
      limit: limit,
      filters: filters,
    });
    const url = `${baseURL}/${endPoints.getAllArticles}?${params}`;
    const data = yield authGetRequest(url, headers);
   console.log('articles',data)
    if (!data.error) {
       
      yield put(getArticlessuccess(data.articles));
    } else {
      yield put(getuserFailure(data.message));
    }
  } catch (err) {
    yield put(getuserFailure(err.message));
  }
}

export function* getArticlesInitSaga(action) {
  yield takeLatest(GET_ARTICLES_INIT, getArticlesInit);
}

function* getuser(action) {
  console.log('ll',action);
  try {
    const headers = {
      Authorization: action.data.token,
    };

    const url = `${baseURL}/${endPoints.profile}?username=${action.data.username}`;
    var data = yield call(authGetRequest, url, headers);
   
    const params = new URLSearchParams({
        skip: 0,
        limit: 100,
        username: action.data.username,
      });
    const url1=`${baseURL}/users/followers?${params}`;
    
    var follower=yield call(authGetRequest,url1,headers)
    console.log('follower',follower);
    const url2=`${baseURL}/users/following?${params}`;
    var following=yield call(authGetRequest,url2,headers)
    console.log('follow',follower,following)
    console.log(data);
    // data=INIT_DATA;
    const map=new Map();
    following.following.forEach((x)=>{
      map.set(x,1);
    })

    
    follower.followers=follower.followers.map(ele=>{
      return {
        name:ele,
        img:AlexTanario,
        isfollowing:map.has(ele)
      }
    })
    following.following=following.following.map(ele=>{
      return{name:ele,
      img:AlexTanario}
    })
    if (!data.error) {
      yield put(getuserSuccess({...data,...follower,...following}));
    } else {
      yield put(getuserFailure(data.message));
    }
  } catch (err) {
    yield put(getuserFailure(err.message));
  }
}

export function* getuserSaga() {
  yield takeLatest(GET_USER_DATA_INIT, getuser);
}
