import {
  SUBMIT_INIT,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE,
} from "../../utils/actionTypes";

export const submitinit = (data) => {
  
  return {
    type: SUBMIT_INIT,
    data,
  };
};

export const submitSuccess = (data) => {
  return {
    type: SUBMIT_SUCCESS,
    data,
  };
};

export const submitfailure = (data) => {
  return {
    type: SUBMIT_FAILURE,
    data,
  };
};
