import {
  GET_ABOUT_PUBLICATION_SUCCESS,
  GET_ARTICLES_FOR_PUBLICATION_INIT,
  GET_ARTICLES_FOR_PUBLICATION_SUCCESS,
  GET_HOME_PAGE_DATA_FAILURE,
  GET_HOME_PAGE_DATA_INIT,
  GET_HOME_PAGE_DATA_SUCCESS,
  GET_LATEST_ARTICLES_FOR_WRITER_INIT,
  GET_LATEST_ARTICLES_FOR_WRITER_SUCCESS,
  HOMEPAGE_SET_ACTIVE_INDEX_DATA,
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

  isGettingLatestForWriter: false,
  getLatestForWriterSuccess: false,
  getLatestForWriterFailure: false,

  activeIdx: 0,
};

const homepage = (state = initialState, action) => {
  const { data } = action;
  // console.log(data);
  let writer, articles, newUserList;
  if (
    action.type === "GET_LATEST_ARTICLES_FOR_WRITER_SUCCESS" ||
    action.type === "GET_ARTICLES_FOR_PUBLICATION_SUCCESS"
  ) {
    writer = action.data.writer;
    articles = action.data.articles;
  }
  // console.log(writer, articles);
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
      newUserList = state.userlist;
      newUserList[writer].articles = articles;
      return {
        ...state,
        userlist: newUserList,
      };
    case GET_LATEST_ARTICLES_FOR_WRITER_INIT:
      return {
        ...state,
        isGettingLatestForWriter: true,
        getLatestForWriterSuccess: false,
        getLatestForWriterFailure: false,
      };
    case GET_LATEST_ARTICLES_FOR_WRITER_SUCCESS:
      newUserList = state.userlist;
      newUserList[writer].articles = articles;
      return { ...state, userlist: newUserList };
    case HOMEPAGE_SET_ACTIVE_INDEX_DATA:
      return {
        ...state,
        activeIdx: data.activeIdx,
      };
    default:
      return state;
  }
};

export default homepage;
