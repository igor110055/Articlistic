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
} from '../../utils/actionTypes';


const initialState = {
    isUploadingImage: false,
    uplodaImageError: false,
    uploadImageErrorMsg: '',
    uploadImageResp: {},
    isCreatingNewArticle: false,
    createNewArticleError: false,
    createNewArticleErrorMsg: '',
    createNewArticleResp: {},
    isUploadingArticle: false,
    uploadArticleError: false,
    uploadArticleErrorMsg: '',
    uploadArticleResp: {},
    isGettingArticle: false,
    getArticleError: false,
    getArticleErrorMsg: '',
    getArticleResp: {},
    isGettingAllArticles: false,
    getAllArticlesError: false,
    getAllArticlesErrorMsg: '',
    getAllArticlesResp: {},
    isDiscardingArticle: false,
    discardArticleError: false,
    discardArticleErrorMsg: '',
    discardArticleResp: {},
};

const writerEditor = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_IMAGE_INIT:
            return {
                ...state,
                isUploadingImage: true,
                uploadImageError: false,
            };

        case UPLOAD_IMAGE_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isUploadingImage: false,
                uploadImageResp: data.writers,
            };
        }

        case UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
                isUploadingImage: false,
                uploadImageError: true,
                uploadImageErrorMsg: action.error,
            };

        case CREATE_NEW_ARTICLE_INIT:
            return {
                ...state,
                isCreatingNewArticle: true,
                createNewArticleError: false,
            };

        case CREATE_NEW_ARTICLE_SUCCESS: {
            const { data } = action;
            // console.log(data);
            return {
                ...state,
                isCreatingNewArticle: false,
                createNewArticleResp: data,
            };
        }

        case CREATE_NEW_ARTICLE_FAILURE:
            return {
                ...state,
                isCreatingNewArticle: false,
                createNewArticleError: true,
                createNewArticleErrorMsg: action.error,
            };

        case UPLOAD_ARTICLE_INIT:
            return {
                ...state,
                isUploadingArticle: true,
                uploadArticleError: false,
            };

        case UPLOAD_ARTICLE_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isUploadingArticle: false,
                uploadArticleResp: data,
            };
        }

        case UPLOAD_ARTICLE_FAILURE:
            return {
                ...state,
                isUploadingArticle: false,
                uploadArticleError: true,
                uploadArticleErrorMsg: action.error,
            };

        case GET_ARTICLE_INIT:
            return {
                ...state,
                isGettingArticle: true,
                getArticleError: false,
            };

        case GET_ARTICLE_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingArticle: false,
                getArticleResp: data,
            };
        }

        case GET_ARTICLE_FAILURE:
            return {
                ...state,
                isGettingArticle: false,
                getArticleError: true,
                getArticleErrorMsg: action.error,
            };

        case GET_ALL_ARTICLES_INIT:
            return {
                ...state,
                isGettingAllArticles: true,
                getAllArticlesError: false,
            };

        case GET_ALL_ARTICLES_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isGettingAllArticles: false,
                getAllArticlesResp: data,
            };
        }

        case GET_ALL_ARTICLES_FAILURE:
            return {
                ...state,
                isGettingAllArticles: false,
                getAllArticlesError: true,
                getAllArticlesErrorMsg: action.error,
            };

        case DISCARD_ARTICLE_INIT:
            return {
                ...state,
                isDiscardingArticle: true,
                discardArticleError: false,
            };

        case DISCARD_ARTICLE_SUCCESS: {
            const { data } = action;
            return {
                ...state,
                isDiscardingArticle: false,
                discardArticleResp: data,
            };
        }

        case DISCARD_ARTICLE_FAILURE:
            return {
                ...state,
                isDiscardingArticle: false,
                discardArticleError: true,
                discardArticleErrorMsg: action.error,
            };

        default:
            return state;
    }
};

export default writerEditor;
