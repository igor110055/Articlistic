import {
  GET_PUBLICATIONS_SUCCESS,
  GET_PUBLICATIONS_FAILURE,
  GET_PUBLICATIONS_INIT,
  CREATE_PUBLICATIONS_SUCCESS,
  CREATE_PUBLICATIONS_FAILURE,
  CREATE_PUBLICATIONS_INIT,
  UPDATE_PUBLICATIONS_FAILURE,
  UPDATE_PUBLICATIONS_INIT,
  UPDATE_PUBLICATIONS_SUCCESS,
  CREATE_ABOUT_PUBLICATION_INIT,
  CREATE_ABOUT_PUBLICATION_SUCCESS,
  CREATE_ABOUT_PUBLICATION_FAILURE,
  GET_ABOUT_PUBLICATION_INIT,
  GET_ABOUT_PUBLICATION_SUCCESS,
  GET_ABOUT_PUBLICATION_FAILURE,
  // DELETE_ARTICLE_INIT,
  DELETE_PUBLICATION,
  DELETE_PUBLICATION_SUCCESS
  // DELETE_ARTICLE_SUCCESS
} from "../../utils/actionTypes";
import { publicationAboutDefault } from "../../utils/common";

const initialError = "Some error happened. Please Try again.";

const INITIAL_ABOUT = publicationAboutDefault;

const initialState = {
  publicationsData: [],
  isGettingPublications: false,
  publicationsError: false,
  publicationsErrorMsg: initialError,
  isCreatingPublication: false,
  infoMsg: "",
  aboutPublicationError: false,
  aboutPublication: INITIAL_ABOUT,
  updateAboutError: false,
  isUpdatingAboutPublication: false,
  aboutPublicationMsg: "",
  createPublicationError: false,
  isUpdatingPublication: false,
  updatePublicationError: false,
  updatePublicationErrorMsg: initialError,
  isArticleDeleteInitiated: false,
  deletedArticles: {}
};

const writerContent = (state = initialState, action) => {
  const { data } = action;
  // const articleId = data?.articleId;
  // console.log("data", data);
  switch (action.type) {
    case GET_PUBLICATIONS_INIT:
      return {
        ...state,
        isGettingPublications: true,
        publicationsError: false
      };

    case GET_PUBLICATIONS_SUCCESS:
      return {
        ...state,
        publicationsData: data,
        isGettingPublications: false,
        publicationsError: false
      };

    case GET_PUBLICATIONS_FAILURE:
      return {
        ...state,
        publicationsError: true,
        isGettingPublications: false,
        publicationsErrorMsg: action.error
      };

    case CREATE_PUBLICATIONS_INIT: {
      return {
        ...state,
        isCreatingPublication: true,
        createPublicationError: false
      };
    }

    case CREATE_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        publicationsData: [data, ...state.publicationsData],
        infoMsg: data.message,
        isCreatingPublication: false,
        createPublicationError: false
      };
    }

    case CREATE_PUBLICATIONS_FAILURE: {
      return {
        ...state,
        isCreatingPublication: false,
        createPublicationError: true
      };
    }

    case UPDATE_PUBLICATIONS_INIT: {
      return {
        ...state,
        isUpdatingPublication: true,
        updatePublicationError: false
      };
    }

    case UPDATE_PUBLICATIONS_SUCCESS: {
      return {
        ...state,
        publicationsData: state.publicationsData.map(publication => {
          if (publication.publicationId === data.publicationId) {
            if (!data.publicationPic) {
              data.publicationPic = publication.publicationPic;
            } else {
              data.publicationPic = data.publicationPic;
            }
            return { ...publication, ...data };
          }
          return publication;
        }),
        infoMsg: data.message,
        isUpdatingPublication: false
      };
    }
    case DELETE_PUBLICATION: {
      return {
        ...state,
        isDeletePublicationInit: true
      };
    }
    case DELETE_PUBLICATION_SUCCESS: {
      return {
        ...state,
        publicationsData: state.publicationsData.map(publication => {
          if (publication.publicationId === data.publicationId) {
            return {
              ...publication,
              deleteAt: Date.now() + 86400000
            };
          } else return publication;
        })
      };
    }
    case UPDATE_PUBLICATIONS_FAILURE: {
      return {
        ...state,
        isUpdatingPublication: false,
        updatePublicationError: true,
        updatePublicationErrorMsg: action.error
      };
    }

    case CREATE_ABOUT_PUBLICATION_INIT: {
      return {
        ...state,
        isUpdatingAboutPublication: true
      };
    }

    case CREATE_ABOUT_PUBLICATION_SUCCESS: {
      return {
        ...state,
        isUpdatingAboutPublication: false,
        updateAboutError: false,
        aboutPublicationMsg: "Successfully Updated"
      };
    }

    case CREATE_ABOUT_PUBLICATION_FAILURE: {
      return {
        ...state,
        isUpdatingAboutPublication: false,
        updateAboutError: true,
        aboutPublicationMsg: "Some error happened while updating"
      };
    }

    case GET_ABOUT_PUBLICATION_INIT: {
      return {
        ...state,
        isGettingAboutPublication: true
      };
    }

    case GET_ABOUT_PUBLICATION_SUCCESS: {
      return {
        ...state,
        aboutPublication: data,
        isGettingAboutPublication: false
      };
    }
    case GET_ABOUT_PUBLICATION_FAILURE: {
      return {
        ...state,
        isGettingAboutPublication: false,
        aboutPublication: INITIAL_ABOUT,
        aboutPublicationError: true
      };
    }

    default:
      return state;
  }
};

export default writerContent;
