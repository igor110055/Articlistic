import {
  GET_STORY_INIT,
  GET_STORY_SUCCESS,
  GET_STORY_FAILURE,
  GET_MORE_FROM_WRITER_INIT,
  GET_MORE_FROM_WRITER_SUCCESS,
  GET_MORE_FROM_WRITER_FAILURE
} from "../../utils/actionTypes";

export const getStoryInit = data => {
  return {
    type: GET_STORY_INIT,
    data
  };
};

export const getStorySuccess = data => {
  return {
    type: GET_STORY_SUCCESS,
    data
  };
};

export const getStoryFailure = data => {
  return {
    type: GET_STORY_FAILURE,
    data
  };
};

export const getMoreFromWriterInit = data => {
  return {
    type: GET_MORE_FROM_WRITER_INIT,
    data
  };
};

export const getMoreFromWriterSuccess = data => {
  return {
    type: GET_MORE_FROM_WRITER_SUCCESS,
    data
  };
};

export const getMoreFromWriterFailure = data => {
  return {
    type: GET_MORE_FROM_WRITER_FAILURE,
    data
  };
};
