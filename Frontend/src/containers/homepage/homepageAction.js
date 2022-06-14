import {
  GET_HOME_PAGE_DATA_INIT,
  GET_HOME_PAGE_DATA_FAILURE,
  GET_HOME_PAGE_DATA_SUCCESS,
  GET_ARTICLES_FOR_PUBLICATION_FAILURE,
  GET_ARTICLES_FOR_PUBLICATION_SUCCESS,
  GET_ARTICLES_FOR_PUBLICATION_INIT,
  GET_LATEST_ARTICLES_FOR_WRITER_INIT,
  GET_LATEST_ARTICLES_FOR_WRITER_SUCCESS,
  GET_LATEST_ARTICLES_FOR_WRITER_FAILURE,
} from "../../utils/actionTypes";

export const getWritersandArticles = (data) => {
  return {
    type: GET_HOME_PAGE_DATA_INIT,
    data,
  };
};

export const getWritersSuccess = (data) => {
  return {
    type: GET_HOME_PAGE_DATA_SUCCESS,
    data,
  };
};

export const getWritersFailure = (data) => {
  return {
    type: GET_HOME_PAGE_DATA_FAILURE,
    data,
  };
};

export const getArticlesForPublicationInit = (data) => {
  return {
    type: GET_ARTICLES_FOR_PUBLICATION_INIT,
    data,
  };
};
export const getArticlesForPublicationSuccess = (data) => {
  return {
    type: GET_ARTICLES_FOR_PUBLICATION_SUCCESS,
    data,
  };
};
export const getArticlesForPublicationFailure = (data) => {
  return {
    type: GET_ARTICLES_FOR_PUBLICATION_FAILURE,
    data,
  };
};

export const getLatestArticlesForWriterInit = (data) => {
  return {
    type: GET_LATEST_ARTICLES_FOR_WRITER_INIT,
    data,
  };
};

export const getLatestArticlesForWriterSuccess = (data) => {
  return {
    type: GET_LATEST_ARTICLES_FOR_WRITER_SUCCESS,
    data,
  };
};

export const getLatestArticlesForWriterFailure = (data) => {
  return {
    type: GET_LATEST_ARTICLES_FOR_WRITER_FAILURE,
    data,
  };
};
