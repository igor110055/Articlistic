import {
  GET_ARTICLES_INIT,
  GET_ARTICLES_SUCCESS,
  GET_ARTICLES_FAILURE,
  DELETE_ARTICLE_INIT,
  DELETE_ARTICLE_SUCCESS,
  DELETE_ARTICLE_FAILURE
} from "../../../utils/actionTypes";

const initialState = {
  draftedArticleData: [],
  publishedArticleData: [],
  // articleData: [],
  isGettingArticles: false,
  articlesError: false,
  getArticlesErrorMsg: "",
  btnVisible: true
};

const ArticleData = (state = initialState, action) => {
  // console.log(action);
  // console.log(state);
  switch (action.type) {
    case GET_ARTICLES_INIT:
      return {
        ...state,
        isGettingArticles: true,
        articlesError: false
      };

    case GET_ARTICLES_SUCCESS:
      if (action.data.filters === "DRAFT")
        return {
          ...state,
          isGettingArticles: false,
          articlesError: false,
          getArticlesErrorMsg: "",
          draftedArticleData: action.data.articles,
          btnVisible: action.data.btnVisible
        };
      else
        return {
          ...state,
          isGettingArticles: false,
          articlesError: false,
          getArticlesErrorMsg: "",
          publishedArticleData: action.data.articles,
          btnVisible: action.data.btnVisible
        };

    case GET_ARTICLES_FAILURE: {
      return {
        ...state,
        getArticlesErrorMsg: action.error,
        articlesError: true
      };
    }
    case DELETE_ARTICLE_INIT:
      return {
        ...state
      };
    case DELETE_ARTICLE_SUCCESS:
      if (action.data.filters === "DRAFT")
        return {
          ...state,
          draftedArticleData: state.draftedArticleData.filter(
            article => article.articleId !== action.data.articleId
          )
        };
      else
        return {
          ...state,
          publishedArticleData: state.publishedArticleData.filter(
            article => article.articleId !== action.data.articleId
          )
        };
    case DELETE_ARTICLE_FAILURE:
      return {
        ...state,
        articlesError: true,
        getArticlesErrorMsg: action.data.message
      };
    default:
      return state;
  }
};

export default ArticleData;
