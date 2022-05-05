import {
    HIDE_SNACKBAR,
    SHOW_SNACKBAR,
  } from './../../utils/actionTypes';
  
  // eslint-disable-next-line import/prefer-default-export
  export const showSnackbar = (message, variant) => {
    return {
      type: SHOW_SNACKBAR,
      payload: {
        message, variant,
      },
    };
  };

  export const hideSnackbar = () => {
    return {
      type: HIDE_SNACKBAR,
      payload: {},
    };
  };
  