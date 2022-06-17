import {
    GET_USER_DATA_INIT,
    GET_USER_DATA_FAILURE,
    GET_USER_DATA_SUCCESS,GET_ARTICLES_INIT, GET_ARTICLES_SUCCESS
  } from "../../utils/actionTypes";
  
  export const getuser = (data) => {
    
    return {
      type: GET_USER_DATA_INIT,
      data,
    };
  };

  export const getArticlessuccess=data=>{
    console.log('success',data)
      return {type:GET_ARTICLES_SUCCESS,data};
  }
export const getArticlesInit = data => {
    // console.log("fromActions", data);
    return {
      type: GET_ARTICLES_INIT,
      data
    };
  };
  export const getuserSuccess = (data) => {
    return {
      type: GET_USER_DATA_SUCCESS,
      data,
    };
  };
  
  export const getuserFailure = (data) => {
    return {
      type: GET_USER_DATA_FAILURE,
      data,
    };
  };
  