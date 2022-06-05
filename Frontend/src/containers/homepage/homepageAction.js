import {
  GET_HOME_PAGE_DATA_INIT,
  GET_HOME_PAGE_DATA_FAILURE,
  GET_HOME_PAGE_DATA_SUCCESS,
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
