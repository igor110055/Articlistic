import {
  CREATE_ABOUT_PUBLICATION_FAILURE,
  CREATE_ABOUT_PUBLICATION_INIT,
  CREATE_ABOUT_PUBLICATION_SUCCESS,
  CREATE_PUBLICATIONS_FAILURE,
  CREATE_PUBLICATIONS_INIT,
  CREATE_PUBLICATIONS_SUCCESS,
  GET_ABOUT_PUBLICATION_FAILURE,
  GET_ABOUT_PUBLICATION_INIT,
  GET_ABOUT_PUBLICATION_SUCCESS,
  GET_PUBLICATIONS_FAILURE,
  GET_PUBLICATIONS_INIT,
  GET_PUBLICATIONS_SUCCESS,
  UPDATE_PUBLICATIONS_FAILURE,
  UPDATE_PUBLICATIONS_INIT,
  UPDATE_PUBLICATIONS_SUCCESS,
  DELETE_PUBLICATION,
  DELETE_PUBLICATION_SUCCESS
} from "./../../utils/actionTypes";

export const getPublications = data => {
  return {
    type: GET_PUBLICATIONS_INIT,
    data
  };
};

export const getPublicationsSuccess = data => {
  return {
    type: GET_PUBLICATIONS_SUCCESS,
    data
  };
};

export const getPublicationsFailure = data => {
  return {
    type: GET_PUBLICATIONS_FAILURE,
    data
  };
};

export const createPublications = data => {
  return {
    type: CREATE_PUBLICATIONS_INIT,
    data
  };
};

export const createPublicationsSuccess = data => {
  return {
    type: CREATE_PUBLICATIONS_SUCCESS,
    data
  };
};

export const createPublicationsFailure = data => {
  return {
    type: CREATE_PUBLICATIONS_FAILURE,
    data
  };
};

export const createAboutPublication = data => {
  return {
    type: CREATE_ABOUT_PUBLICATION_INIT,
    data
  };
};

export const createAboutPublicationSuccess = data => {
  return {
    type: CREATE_ABOUT_PUBLICATION_SUCCESS,
    data
  };
};

export const createAboutPublicationFailure = data => {
  return {
    type: CREATE_ABOUT_PUBLICATION_FAILURE,
    data
  };
};

export const updatePublication = data => {
  return {
    type: UPDATE_PUBLICATIONS_INIT,
    data
  };
};

export const deletePublication = data => {
  return {
    type: DELETE_PUBLICATION,
    data
  };
};

export const deletePublicationSuccess = data => {
  return {
    type: DELETE_PUBLICATION_SUCCESS,
    data
  };
};

export const updatePublicationsSuccess = data => {
  return {
    type: UPDATE_PUBLICATIONS_SUCCESS,
    data
  };
};

export const updatePublicationsFailure = data => {
  return {
    type: UPDATE_PUBLICATIONS_FAILURE,
    data
  };
};

export const getAboutPublication = data => {
  return {
    type: GET_ABOUT_PUBLICATION_INIT,
    data
  };
};

export const getAboutPublicationSuccess = data => {
  return {
    type: GET_ABOUT_PUBLICATION_SUCCESS,
    data
  };
};

export const getAboutPublicationFailure = data => {
  return {
    type: GET_ABOUT_PUBLICATION_FAILURE,
    data
  };
};
