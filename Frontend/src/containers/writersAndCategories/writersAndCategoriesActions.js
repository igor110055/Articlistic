import {
  GET_CATEGORIES_WRITERS_SUCCESS,
  GET_CATEGORIES_WRITERS_FAILURE,
  GET_CATEGORIES_WRITERS_INIT,
  GET_STATUS_SUCCESS,
  GET_STATUS_FAILURE,
  GET_STATUS_INIT,
  ADD_WRITER,
  REMOVE_WRITER,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  SEND_SELECTED_SUCCESS,
  SEND_SELECTED_FAILURE,
  SEND_SELECTED_INIT,
} from '../../utils/actionTypes';

export const getCategoriesWritersSuccess = (data) => {
  return {
    type: GET_CATEGORIES_WRITERS_SUCCESS,
    data,
  };
};

export const getCategoriesWritersFailure = (error) => {
  // console.log(error);
  return {
    type: GET_CATEGORIES_WRITERS_FAILURE,
    error,
  };
};

export const getCategoriesWriters = (params, headers) => {
  const payload = { params, headers };
  return {
    type: GET_CATEGORIES_WRITERS_INIT,
    payload,
  };
};

export const getStatusSuccess = (data) => {
  return {
    type: GET_STATUS_SUCCESS,
    data,
  };
};

export const getStatusFailure = (error) => {
  return {
    type: GET_STATUS_FAILURE,
    error,
  };
};

export const getStatus = (params) => {
  const payload = params;
  return {
    type: GET_STATUS_INIT,
    payload,
  };
};

export const addWriter = (id) => {
  return {
    type: ADD_WRITER,
    id: id,
  };
};

export const removeWriter = (id) => {
  return {
    type: REMOVE_WRITER,
    id: id,
  };
};

export const addCategory = (id) => {
  return {
    type: ADD_CATEGORY,
    id: id,
  };
};

export const removeCategory = (id) => {
  return {
    type: REMOVE_CATEGORY,
    id: id,
  };
};

export const sendSelectedSuccess = (data) => {
  return {
    type: SEND_SELECTED_SUCCESS,
    data,
  };
};

export const sendSelectedFailure = (error) => {
  return {
    type: SEND_SELECTED_FAILURE,
    error,
  };
};

export const sendSelected = (params, headers) => {
  const payload = { params, headers };
  // console.log(payload);
  return {
    type: SEND_SELECTED_INIT,
    payload,
  };
};