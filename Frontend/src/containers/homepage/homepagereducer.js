import {
  GET_ABOUT_PUBLICATION_SUCCESS,
  GET_ARTICLES_FOR_PUBLICATION_INIT,
  GET_ARTICLES_FOR_PUBLICATION_SUCCESS,
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

  isGettingPublicationArticles: false,
  publicationArticlesSuccess: false,
  publicationArticlesError: false,
};

const homepage = (state = initialState, action) => {
  const { data } = action;

  // if (action.type === "GET_ARTICLES_FOR_PUBLICATION_SUCCESS") {
  //   console.log(action.data);
  // }
  switch (action.type) {
    case GET_HOME_PAGE_DATA_INIT:
      return {
        ...state,
        isGettinglist: true,
        listError: false,
      };

    case GET_HOME_PAGE_DATA_SUCCESS:
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
    case GET_ARTICLES_FOR_PUBLICATION_INIT:
      return {
        ...state,
        isGettingPublicationArticles: true,
        publicationArticlesSuccess: false,
        publicationArticlesError: false,
      };
    case GET_ARTICLES_FOR_PUBLICATION_SUCCESS:
      return {
        ...state,
        userlist: {
          ...state.userlist,
          writer: action.data.articles,
        },
      };
    default:
      return state;
  }
};

export default homepage;
