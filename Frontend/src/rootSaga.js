import { all, spawn } from "redux-saga/effects";
import * as writerSagas from "./containers/writersAndCategories/writersAndCategoriesSaga";
// import * as loginSignupSagas from "./containers/loginSignup/loginSignupSaga";
import * as writerEditorSagas from "./containers/writerEditor/writerEditorSaga";
import * as unsplashSagas from "./containers/unsplash/unsplashSaga";
import * as nftSagas from "./containers/writerEditor/nftBlock/nftSaga";
import * as followedWritersSagas from "./containers/home/homeSaga";
import * as writerContentSagas from "./containers/writerContent/writerSaga";
import * as articleSagas from "./containers/writerContent/components/articleSaga";
import * as signupSaga from "./containers/authentication/signupSaga";
export default function* rootSaga() {
  yield all(
    [
      ...Object.values(writerSagas),
      // ...Object.values(loginSignupSagas),
      ...Object.values(writerEditorSagas),
      ...Object.values(unsplashSagas),
      ...Object.values(nftSagas),
      ...Object.values(followedWritersSagas),
      ...Object.values(writerContentSagas),
      ...Object.values(articleSagas),
      ...Object.values(signupSaga),
    ].map(spawn)
  );
}
