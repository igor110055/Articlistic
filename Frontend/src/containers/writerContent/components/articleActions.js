import {
  GET_ARTICLES_INIT,
  GET_ARTICLES_SUCCESS,
  GET_ARTICLES_FAILURE,
  DELETE_ARTICLE_INIT,
  DELETE_ARTICLE_SUCCESS,
  DELETE_ARTICLE_FAILURE
} from "../../../utils/actionTypes";

export const getArticlesInit = data => {
  // console.log("fromActions", data);
  return {
    type: GET_ARTICLES_INIT,
    data
  };
};
export const getArticlesSuccess = data => {
  return {
    type: GET_ARTICLES_SUCCESS,
    data
  };
};
export const getArticlesFailure = data => {
  return {
    type: GET_ARTICLES_FAILURE,
    data
  };
};
export const deleteArticleInit = data => {
  return {
    type: DELETE_ARTICLE_INIT,
    data
  };
};
export const deleteArticleSuccess = data => {
  return {
    type: DELETE_ARTICLE_SUCCESS,
    data
  };
};
export const deleteArticleFailure = data => {
  return {
    type: DELETE_ARTICLE_FAILURE,
    data
  };
};
