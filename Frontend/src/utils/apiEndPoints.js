export const baseURL = process.env.REACT_APP_SERVER_LINK;
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
};
