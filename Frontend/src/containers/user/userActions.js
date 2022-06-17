import {
  USER_EMAIL,
  USER_USERNAME,
  USER_PASSWORD,
  USER_PHONE,
  USER_NAME,
} from "../../utils/actionTypes";

export const userEmail = (data) => {
  return {
    type: USER_EMAIL,
    data,
  };
};

export const userUsername = (data) => {
  return {
    type: USER_USERNAME,
    data,
  };
};

export const userPassword = (data) => {
  return {
    type: USER_PASSWORD,
    data,
  };
};

export const userPhone = (data) => {
  return {
    type: USER_PHONE,
    data,
  };
};

export const userPName = (data) => {
  return {
    type: USER_NAME,
    data,
  };
};
