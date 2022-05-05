import axios from "axios";
import { ErrorMessage } from "../containers/loginSignup/helper_functions/errorMessageFunction";

export const getRequest = async (url) => {
  try {
    const headers = {
      method: "GET",
      header: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
      },
    };
    const data = await axios
      .get(url, headers)
      .then((resp) => resp.data)
      .catch((err) => getErrorResponse(err));
    return data;
  } catch (e) {
    return e;
  }
};

export const postRequest = async (url, postData) => {
  try {
    const data = await axios
      .post(url, postData)
      .then((resp) => resp.data)
      .catch((err) => {
        return getErrorResponse(err);
      });
    return data;
  } catch (e) {
    return e;
  }
};

export const putRequest = async (url, postData) => {
  try {
    const data = await axios
      .put(url, postData)
      .then((resp) => resp.data)
      .catch((err) => getErrorResponse(err));
    return data;
  } catch (e) {
    return e;
  }
};

export const authPostRequest = async (url, postData, headers) => {
  const header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With",
    Authorization: headers.Authorization,
  };
  try {
    const data = await axios
      .post(url, postData, { headers: header })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        getErrorResponse(err);
      });
    return data;
  } catch (e) {
    return e;
  }
};

export const authGetRequest = async (url, headers) => {
  // console.log(headers);
  try {
    const data = await axios
      .get(url, { headers: headers })
      .then((resp) => resp.data)
      .catch((err) => getErrorResponse(err));
    return data;
  } catch (e) {
    return e;
  }
};

export const authPutRequest = async (url, putData, headers) => {
  // console.log(url, putData, headers);
  try {
    const data = await axios
      .put(url, putData, { headers: headers })
      .then((resp) => resp.data)
      .catch((err) => getErrorResponse(err));
    return data;
  } catch (e) {
    return e;
  }
};

const getErrorResponse = (err) => {
  let errorMsg = err.response.data.error.toString() || "Something Went Wrong";
  if (err.response) {
    if (err.response.status === 401) {
      errorMsg = err.response.data.error.toString();
    } else if (err.response.status === 500) {
      errorMsg = "Internal server error, try again later";
    } else if (err.response.status > 500) {
      errorMsg = err.response.data.error.toString();
    }
  }
  return {
    error: true,
    message: ErrorMessage(errorMsg),
  };
};
