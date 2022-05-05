import {
    GET_FOLLOWED_WRITERS_INIT,
    GET_FOLLOWED_WRITERS_SUCCESS,
    GET_FOLLOWED_WRITERS_FAILURE,
    BOOKMARK_ARTICLE_INIT,
    BOOKMARK_ARTICLE_SUCCESS,
    BOOKMARK_ARTICLE_FAILURE,
} from '../../utils/actionTypes';


const initialState = {
    isGettingFollowedWriters: false,
    getFollowedWritersError: false,
    getFollowedWritersErrorMsg: '',
    getFollowedWritersResp: [],
    isBookmarkingArticle: false,
    bookmarkArticleError: false,
    bookmarkArticleErrorMsg: '',
    bookmarkArticleResp: [],
};

const home = (state = initialState, action) => {
    switch (action.type) {
        case GET_FOLLOWED_WRITERS_INIT:
            return {
                ...state,
                isGettingFollowedWriters: true,
                getFollowedWritersError: false,
            };

        case GET_FOLLOWED_WRITERS_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingFollowedWriters: false,
                getFollowedWritersResp: data,
            };
        }

        case GET_FOLLOWED_WRITERS_FAILURE:
            return {
                ...state,
                isGettingFollowedWriters: false,
                getFollowedWritersError: true,
                getFollowedWritersErrorMsg: action.error,
            };

        case BOOKMARK_ARTICLE_INIT:
            return {
                ...state,
                isBookmarkingArticle: true,
                bookmarkArticleError: false,
            };

        case BOOKMARK_ARTICLE_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isBookmarkingArticle: false,
                bookmarkArticleResp: data,
            };
        }

        case BOOKMARK_ARTICLE_FAILURE:
            return {
                ...state,
                isBookmarkingArticle: false,
                bookmarkArticleError: true,
                bookmarkArticleErrorMsg: action.error,
            };

        default:
            return state;
    }
};

export default home;
