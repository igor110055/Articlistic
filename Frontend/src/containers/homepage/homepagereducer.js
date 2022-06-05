import {
  GET_ABOUT_PUBLICATION_SUCCESS,
  GET_HOME_PAGE_DATA_FAILURE,
  GET_HOME_PAGE_DATA_INIT,
  GET_HOME_PAGE_DATA_SUCCESS,
} from "../../utils/actionTypes";

const initialError = "Some error happened. Please Try again.";

const initialState = {
  userlist: [],
  isGettinglist: false,
  listError: false,
  listErrorMsg: initialError,
};

const homepage = (state = initialState, action) => {
  const { data } = action;

  switch (action.type) {
    case GET_HOME_PAGE_DATA_INIT:
      return {
        ...state,
        isGettinglist: true,
        listError: false,
      };

    case GET_ABOUT_PUBLICATION_SUCCESS:
      return {
        ...state,
        userlist: data,
        isGettinglist: false,
        listError: false,
      };

    case GET_HOME_PAGE_DATA_FAILURE:
      return {
        ...state,
        listError: true,
        isGettinglist: false,
        listErrorMsg: action.error,
      };
      default:
        return state;  
  }
};


export default homepage;