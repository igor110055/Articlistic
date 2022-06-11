import { all, spawn } from "redux-saga/effects";
import * as writerSagas from "./containers/writersAndCategories/writersAndCategoriesSaga";
import * as writerEditorSagas from "./containers/writerEditor/writerEditorSaga";
import * as unsplashSagas from "./containers/unsplash/unsplashSaga";
import * as nftSagas from "./containers/writerEditor/nftBlock/nftSaga";
import * as followedWritersSagas from "./containers/home/homeSaga";
import * as writerContentSagas from "./containers/writerContent/writerSaga";
import * as articleSagas from "./containers/writerContent/components/articleSaga";
import * as signupSaga from "./containers/authentication/signupSaga";
import * as homePageSaga from "./containers/homepage/homepageSaga";
import * as writerSaga from "./containers/writerform/writerformsaga";
import * as walletSaga from "./containers/wallet/walletSaga";
import * as storySaga from "./containers/story/storySaga";
export default function* rootSaga() {
  yield all(
    [
      ...Object.values(writerSagas),
      ...Object.values(writerEditorSagas),
      ...Object.values(unsplashSagas),
      ...Object.values(nftSagas),
      ...Object.values(followedWritersSagas),
      ...Object.values(writerContentSagas),
      ...Object.values(articleSagas),
      ...Object.values(signupSaga),
      ...Object.values(homePageSaga),
      ...Object.values(writerSaga),
      ...Object.values(walletSaga),
      ...Object.values(storySaga),
    ].map(spawn)
  );
}
