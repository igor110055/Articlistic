import {
  GET_STORY_INIT,
  GET_STORY_SUCCESS,
  GET_STORY_FAILURE
} from "../../utils/actionTypes";

const initialState = {
  isFetchingStory: false,
  story: {},
  storyError: false,
  storyErrorMsg: ""
};

const storyReducer = (state = initialState, action) => {
  //   console.log("reducer", action);
  switch (action.type) {
    case GET_STORY_INIT:
      return {
        ...state,
        isFetchingStory: true
      };
    case GET_STORY_SUCCESS:
      return {
        ...state,
        story: action.data,
        isFetchingStory: false,
        storyErrorMsg: "",
        storyError: false
      };
    case GET_STORY_FAILURE:
      return {
        ...state,
        isFetchingStory: false,
        storyError: true,
        storyErrorMsg: action.data,
        story: {}
      };
    default:
      return state;
  }
};

export default storyReducer;
