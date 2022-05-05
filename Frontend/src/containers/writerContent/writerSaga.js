import { put, call, takeLatest } from "redux-saga/effects";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import {
  // getRequest,
  authGetRequest,
  authPostRequest,
  authPutRequest,
  authDeleteRequest
} from "../../utils/apiRequests";
import {
  CREATE_ABOUT_PUBLICATION_INIT,
  CREATE_PUBLICATIONS_INIT,
  GET_ABOUT_PUBLICATION_INIT,
  GET_PUBLICATIONS_INIT,
  UPDATE_PUBLICATIONS_INIT,
  DELETE_PUBLICATION
} from "../../utils/actionTypes";
import {
  createAboutPublicationFailure,
  createAboutPublicationSuccess,
  createPublicationsFailure,
  createPublicationsSuccess,
  getAboutPublicationFailure,
  getAboutPublicationSuccess,
  getPublicationsFailure,
  getPublicationsSuccess,
  updatePublicationsFailure,
  updatePublicationsSuccess,
  deletePublicationSuccess,
  // deleteArticleSuccess
} from "./writerActions";

function* getPublications(action) {
  try {
    const headers = {
      Authorization: action.data.token
    };

    const url = `${baseURL}/${endPoints.getPublications}?username=${action.data.userUserName}`;
    const data = yield call(authGetRequest, url, headers);

    if (!data.error) {
      yield put(getPublicationsSuccess(data.publications));
    } else {
      yield put(getPublicationsFailure(data.message));
    }
  } catch (err) {
    yield put(getPublicationsFailure(err.message));
  }
}

export function* getPublicationsSaga() {
  yield takeLatest(GET_PUBLICATIONS_INIT, getPublications);
}

function* getAboutPublication(action) {
  try {
    const headers = {
      Authorization: action.data.token
    };

    const url = `${baseURL}/${endPoints.updateAboutPublication}?publicationId=${action.data.publicationId}`;
    const data = yield call(authGetRequest, url, headers);
    if (!data.error) {
      yield put(getAboutPublicationSuccess(data));
    } else {
      yield put(getAboutPublicationFailure(data.message));
    }
  } catch (err) {
    yield put(getPublicationsFailure(err.message));
  }
}

export function* getAboutPublicationSaga() {
  yield takeLatest(GET_ABOUT_PUBLICATION_INIT, getAboutPublication);
}

function* createPublication(action) {
  try {
    const headers = {
      Authorization: action.data.token
    };
    const url = `${baseURL}/${endPoints.createNewPublications}?username=${action.data.userUserName}&name=${action.data.name}`;
    const data = yield call(authPostRequest, url, action.data.fd, headers);

    if (!data.error) {
      yield put(createPublicationsSuccess(data));
    } else {
      yield put(createPublicationsFailure(data.message));
    }
  } catch (err) {
    yield put(createPublicationsFailure(err.message));
  }
}

export function* createPublicationSaga() {
  yield takeLatest(CREATE_PUBLICATIONS_INIT, createPublication);
}

function* createAboutPublication(action) {
  const aboutPublicationData = JSON.parse(action.data.publicationData);

  try {
    const { userUserName, name, publicationId, publicationData } = action.data;
    const headers = {
      Authorization: action.data.token
    };
    const url = `${baseURL}/${endPoints.updateAboutPublication}?publicationId=${publicationId}&username=${userUserName}&name=${name}`;
    const data = yield call(
      authPutRequest,
      url,
      {
        writeup: publicationData,
        publicationId,
        intro: aboutPublicationData.blocks[0].data.text
      },
      headers
    );

    if (!data.error) {
      yield put(createAboutPublicationSuccess(data.message));
    } else {
      yield put(createAboutPublicationFailure(data.message));
    }
  } catch (err) {
    yield put(createAboutPublicationFailure(err.message));
  }
}

export function* createAboutPublicationSaga() {
  yield takeLatest(CREATE_ABOUT_PUBLICATION_INIT, createAboutPublication);
}

function* updatePublication(action) {
  try {
    const { userUserName, name, publicationId } = action.data;
    const headers = {
      Authorization: action.data.token
    };
    const url = `${baseURL}/${endPoints.updatePublication}?publicationId=${publicationId}&username=${userUserName}&name=${name}`;
    const data = yield call(authPutRequest, url, action.data.fd, headers);
    data.publicationId = publicationId;
    data.publicationName = name;

    if (!data.error) {
      yield put(updatePublicationsSuccess(data));
    } else {
      yield put(updatePublicationsFailure(data.message));
    }
  } catch (err) {
    yield put(updatePublicationsFailure(err.message));
  }
}

export function* updatePublicationSaga() {
  yield takeLatest(UPDATE_PUBLICATIONS_INIT, updatePublication);
}

// function* deleteArticle(action) {
//   try {
//     const { token, articleId } = action.data;
//     const headers = {
//       Authorization: token
//     };
//     const url = `${baseURL}/${endPoints.deleteArticleComplete}?articleId=${articleId}`;
//
//     const data = yield call(authDeleteRequest, url, headers);
//
//     data.articleId = articleId;
//     yield put(deleteArticleSuccess(data));
//   } catch (e) {}
// }
//
// export function* deleteArticleSaga() {
//   yield takeLatest(DELETE_ARTICLE, deleteArticle);
// }

function* deletePublication(action) {
  try {
    const { token, publicationId } = action.data;
    const headers = {
      Authorization: token
    };
    const url = `${baseURL}/${endPoints.deletePublication}?publicationId=${publicationId}`;

    const data = yield call(authDeleteRequest, url, headers);
    data.publicationId = publicationId;

    yield put(deletePublicationSuccess(data));
  } catch (e) {}
}

export function* deletePublicationSaga() {
  yield takeLatest(DELETE_PUBLICATION, deletePublication);
}
