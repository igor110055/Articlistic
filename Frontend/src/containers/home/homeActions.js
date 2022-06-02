import {
    GET_FOLLOWED_WRITERS_INIT,
    GET_FOLLOWED_WRITERS_SUCCESS,
    GET_FOLLOWED_WRITERS_FAILURE,
    BOOKMARK_ARTICLE_INIT,
    BOOKMARK_ARTICLE_SUCCESS,
    BOOKMARK_ARTICLE_FAILURE,
} from './../../utils/actionTypes';

export const getFollowedWriters = (params, headers) => {
    const payload = { params, headers };
    return {
        type: GET_FOLLOWED_WRITERS_INIT,
        data: payload,
    }
};

export const getFollowedWritersSuccess = (data) => {
    return {
        type: GET_FOLLOWED_WRITERS_SUCCESS,
        data,
    }
};

export const getFollowedWritersFailure = (error) => {
    return {
        type: GET_FOLLOWED_WRITERS_FAILURE,
        error,
    }
};

export const bookmarkArticle = (params, headers) => {
    const payload = { params, headers };
    return {
        type: BOOKMARK_ARTICLE_INIT,
        data: payload,
    }
};

export const bookmarkArticleSuccess = (data) => {
    return {
        type: BOOKMARK_ARTICLE_SUCCESS,
        data,
    }
};

export const bookmarkArticleFailure = (error) => {
    return {
        type: BOOKMARK_ARTICLE_FAILURE,
        error,
    }
};