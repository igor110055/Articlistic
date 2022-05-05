import { SHOW_SNACKBAR, HIDE_SNACKBAR } from '../../utils/actionTypes';

const initialState = {
  snackbar: {
    message: '',
    variant: 'info',
    open: false,
  },
};

const common = (state=initialState, action) => {
  switch (action.type) {
    case SHOW_SNACKBAR: {
      const { message, variant } = action.payload;
      return {
        ...state,
        snackbar: {
          message, variant, open: true,
        },
      };
    };

    case HIDE_SNACKBAR: {
        return {
          ...state,
          snackbar: {
            open: false,
          },
        };
      }

    default:
      return state;
  }
};

export default common;
