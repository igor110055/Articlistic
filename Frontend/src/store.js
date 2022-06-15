import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import writers from "./containers/writersAndCategories/writersAndCategoriesReducer";
// import loginSignup from "./containers/loginSignup/loginSignupReducer";
import signupReducer from "./containers/authentication/signupReducer";
import user from "./containers/user/userReducer";
import writerEditor from "./containers/writerEditor/writerEditorReducer";
import unsplash from "./containers/unsplash/unsplashReducer";
import nft from "./containers/writerEditor/nftBlock/nftReducer";
import home from "./containers/home/homeReducer";
import homepage from "./containers/homepage/homepagereducer";
import common from "./containers/common/commonReducer";
import rootSaga from "./rootSaga";
import writerContent from "./containers/writerContent/writerReducers";
import ArticleData from "./containers/writerContent/components/articleReducer";
import wallet from "./containers/wallet/walletReducer";
import profile from './containers/profile/profileReducer'
const reducer = combineReducers({
  writers,
  // loginSignup,
  signupReducer,
  user,
  writerEditor,
  unsplash,
  nft,
  home,
  homepage,
  common,
  writerContent,
  ArticleData,
  wallet,
  profile
});
const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
