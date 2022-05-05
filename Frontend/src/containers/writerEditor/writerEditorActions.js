import {
    UPLOAD_IMAGE_INIT,
    UPLOAD_IMAGE_SUCCESS,
    UPLOAD_IMAGE_FAILURE,
    CREATE_NEW_ARTICLE_INIT,
    CREATE_NEW_ARTICLE_SUCCESS,
    CREATE_NEW_ARTICLE_FAILURE,
    UPLOAD_ARTICLE_INIT,
    UPLOAD_ARTICLE_SUCCESS,
    UPLOAD_ARTICLE_FAILURE,
    GET_ARTICLE_INIT,
    GET_ARTICLE_SUCCESS,
    GET_ARTICLE_FAILURE,
    GET_ALL_ARTICLES_INIT,
    GET_ALL_ARTICLES_SUCCESS,
    GET_ALL_ARTICLES_FAILURE,
    DISCARD_ARTICLE_INIT,
    DISCARD_ARTICLE_SUCCESS,
    DISCARD_ARTICLE_FAILURE,
} from './../../utils/actionTypes';

export const uploadImage = (params, headers) => {
    const payload = { params, headers };
    return {
        type: UPLOAD_IMAGE_INIT,
        data: payload,
    }
};

export const uploadImageSuccess = (data) => {
    return {
        type: UPLOAD_IMAGE_SUCCESS,
        data,
    }
};

export const uploadImageFailure = (error) => {
    return {
        type: UPLOAD_IMAGE_FAILURE,
        error,
    }
};
export const createNewArticle = (params, headers) => {
    const payload = { params, headers };
    // console.log(payload);
    return {
        type: CREATE_NEW_ARTICLE_INIT,
        data: payload,
    }
};

export const createNewArticleSuccess = (data) => {
    return {
        type: CREATE_NEW_ARTICLE_SUCCESS,
        data,
    }
};

export const createNewArticleFailure = (error) => {
    return {
        type: CREATE_NEW_ARTICLE_FAILURE,
        error,
    }
};

export const uploadArticle = (params, headers) => {
    const payload = { params, headers };
    // console.log(payload);
    return {
        type: UPLOAD_ARTICLE_INIT,
        data: payload,
    }
};

export const uploadArticleSuccess = (data) => {
    return {
        type: UPLOAD_ARTICLE_SUCCESS,
        data,
    }
};

export const uploadArticleFailure = (error) => {
    return {
        type: UPLOAD_ARTICLE_FAILURE,
        error,
    }
};

export const getArticle = (params, headers) => {
    const payload = { params, headers };
    // console.log(payload);
    return {
        type: GET_ARTICLE_INIT,
        data: payload,
    }
};

export const getArticleSuccess = (data) => {
    // console.log(data);
    return {
        type: GET_ARTICLE_SUCCESS,
        data,
    }
};

export const getArticleFailure = (error) => {
    return {
        type: GET_ARTICLE_FAILURE,
        error,
    }
};

export const getAllArticles = (params, headers) => {
    const payload = { params, headers };
    // console.log(payload);
    return {
        type: GET_ALL_ARTICLES_INIT,
        data: payload,
    }
};

export const getAllArticlesSuccess = (data) => {
    // console.log(data);
    return {
        type: GET_ALL_ARTICLES_SUCCESS,
        data,
    }
};

export const getAllArticlesFailure = (error) => {
    return {
        type: GET_ALL_ARTICLES_FAILURE,
        error,
    }
};

export const discardArticle = (params, headers) => {
    const payload = { params, headers };
    // console.log(payload);
    return {
        type: DISCARD_ARTICLE_INIT,
        data: payload,
    }
};

export const discardArticleSuccess = (data) => {
    // console.log(data);
    return {
        type: DISCARD_ARTICLE_SUCCESS,
        data,
    }
};

export const discardArticleFailure = (error) => {
    return {
        type: DISCARD_ARTICLE_FAILURE,
        error,
    }
};