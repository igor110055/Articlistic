import config from "../config";

// console.log("Api end points", config);
// let baseURL = config["REACT_APP_SERVER_LINK"],
//   encryptionSalt = config["REACT_APP_ENCRYPTION_SALT"];

let baseURL;
setTimeout(() => {
  baseURL = config["REACT_APP_SERVER_LINK"];
  console.log(baseURL);
}, 3000);
export { baseURL };

let encryptionSalt;
setTimeout(() => {
  encryptionSalt = config["REACT_APP_ENCRYPTION_SALT"];
  // console.log(encryptionSalt);
}, 3000);
export { encryptionSalt };

let GOOGLE_CLIENT_ID;

setTimeout(() => {
  GOOGLE_CLIENT_ID = config["GOOGLE_CLIENT_ID"];
  // console.log(encryptionSalt);
}, 3000);
export { GOOGLE_CLIENT_ID };
// export const baseURL = process.env.REACT_APP_SERVER_LINK;
// export const encryptionSalt = process.env.REACT_APP_ENCYPTION_SALT;

// export const baseURL = process.env.REACT_APP_SERVER_LINK;
// export const encryptionSalt = process.env.REACT_APP_ENCYPTION_SALT;

export const endPoints = {
  categoriesAndWriters: "onboarding/getCategoriesAndWriters",
  status: "onboarding/getStatus",
  updateStatus: "onboarding/updateStatus",
  login: "onboarding/login",
  checkUsername: "onboarding/checkUsername",
  sendOTP: "onboarding/phone/sendOTP",
  verifyOTP: "onboarding/phone/verifyOTP",
  sendEmailOTP: "onboarding/email/sendOTP",
  verifyEmailOTP: "onboarding/email/verifyOTP",
  createUser: "onboarding/createUser",
  getPickFavData: "onboarding/writers",
  forgotSendOTP: "utils/phone/sendOTP",
  forgotVerifyOTP: "utils/phone/verifyOTP",
  forgotSendEmailOTP: "utils/email/sendOTP",
  forgotVerifyEmailOTP: "utils/email/verifyOTP",
  resetPassword: "utils/resetPassword",
  logout: "utils/logout",
  refreshToken: "utils/refreshToken",
  uploadImage: "articles/uploadImage",
  unsplash:
    "https://api.unsplash.com/search/photos?page=1&client_id=6q218GWJ_v9YTd3O7njaaLdzC4WvPffU-9J1jQErXhg",
  createNewArticle: "articles/new",
  writerdetails: "onboarding/createWriter",
  uploadArticle: "articles/upload",
  getArticle: "articles/get",
  getAllArticles: "articles/getAllArticlesForUser",
  userHomePageGet: "users/homepage",
  bookmarkArticle: "users/bookmarkArticle",
  deleteArticle: "articles/discard",
  getPublications: "publication/all",
  createNewPublications: "publication",
  updatePublication: "publication",
  updateAboutPublication: "publication/article",
  publicationUploadImage: "publication/article/image",
  deleteArticleComplete: "articles/markForDeletion",
  deletePublication: "publication",
  followWriter: "users/followWriter",
  followMultipleWriters: "onboarding/followMultiple",
  googleSignup: "onboarding/google/signup",
  walletSendOTP: "wallet/sendOTP",
  walletActivate: "wallet/activate",
  walletResetPin: "wallet/resetPIN",
  getArticlesForPublication: "articles/getArticlesForPublication",
};
