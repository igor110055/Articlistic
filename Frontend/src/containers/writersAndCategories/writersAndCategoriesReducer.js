import {
  GET_CATEGORIES_WRITERS_INIT,
  GET_CATEGORIES_WRITERS_SUCCESS,
  GET_CATEGORIES_WRITERS_FAILURE,
  GET_STATUS_INIT,
  GET_STATUS_SUCCESS,
  GET_STATUS_FAILURE,
  ADD_WRITER,
  REMOVE_WRITER,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  SEND_SELECTED_INIT,
  SEND_SELECTED_SUCCESS,
  SEND_SELECTED_FAILURE,
} from '../../utils/actionTypes';


const initialState = {
  isGettingWriters: false,
  writers: [],
  categories: [],
  getWritersError: false,
  getWritersErrorMsg: '',
  selectedWriters: {},
  selectedCategories: {},
  isGettingStatus: false,
  getStatusError: false,
  getStatusErrorMsg: "",
  status: {},
  isSendingWritersAndCategories: false,
  sendWritersAndCategories: {},
  sendWritersAndCategoriesError: false,
  sendWritersAndCategoriesErrorMsg: "",
};

const writers = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES_WRITERS_INIT:
      return {
        ...state,
        isGettingWriters: true,
        getWritersError: false,
      };

    case GET_CATEGORIES_WRITERS_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isGettingWriters: false,
        writers: data.writers,
        categories: data.categories,
      };
    }

    case GET_CATEGORIES_WRITERS_FAILURE:
      return {
        ...state,
        isGettingWriters: false,
        getWritersError: true,
        getWritersErrorMsg: action.error,
      };

    case GET_STATUS_INIT:
      return {
        ...state,
        isGettingStatus: true,
        getStatusError: false,
      };

    case GET_STATUS_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isGettingStatus: false,
        status: data,
      };
    }

    case GET_STATUS_FAILURE:
      return {
        ...state,
        isGettingStatus: false,
        getStatusError: true,
        getStatusErrorMsg: action.error,
      };

    case SEND_SELECTED_INIT:
      return {
        ...state,
        isSendingWritersAndCategories: true,
        sendWritersAndCategoriesError: false,
      };

    case SEND_SELECTED_SUCCESS: {
      const { data } = action;
      return {
        ...state,
        isSendingWritersAndCategories: false,
        sendWritersAndCategories: data,
      };
    }

    case SEND_SELECTED_FAILURE:
      return {
        ...state,
        isSendingWritersAndCategories: false,
        sendWritersAndCategoriesError: true,
        sendWritersAndCategoriesErrorMsg: action.error,
      };

    case ADD_WRITER:
      const { id } = action;
      let selectedUsers = state.selectedWriters;
      for (let i = 0; i < state.writers.length; i++) {
        if (id === state.writers[i]._id) {
          selectedUsers[id] = state.writers[i]
          break;
        }
      }
      return {
        ...state,
        selectedWriters: selectedUsers,
      }

    case REMOVE_WRITER:
      const removeWriterId = action.id;
      let currentTempWriters = state.selectedWriters;
      delete currentTempWriters[removeWriterId];

      return {
        ...state,
        selectedWriters: currentTempWriters,
      }

    case ADD_CATEGORY:
      const addCategoryId = action.id;
      let tempCategories = state.selectedCategories;
      for (let i = 0; i < state.categories.length; i++) {
        if (addCategoryId === state.categories[i]._id) {
          tempCategories[addCategoryId] = state.categories[i]
          break;
        }
      }
      return {
        ...state,
        selectedCategories: tempCategories,
      }

    case REMOVE_CATEGORY:
      const removeCategoryId = action.id;
      let currentTempCategories = state.selectedCategories;
      delete currentTempCategories[removeCategoryId];

      return {
        ...state,
        selectedCategories: currentTempCategories,
      }

    default:
      return state;
  }
};

export default writers;
