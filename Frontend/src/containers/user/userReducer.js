import {
    USER_EMAIL,
    USER_NAME,
    USER_PASSWORD,
    USER_PHONE,
    USER_USERNAME,
} from '../../utils/actionTypes';


const initialState = {
    userEmailID: '',
    userProfileName: '',
    userAccountPassword: '',
    userPhoneNumber: '',
    userUserName: '',
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_EMAIL:
            return {
                ...state,
                userEmailID: action.data,
            };

        case USER_NAME:
            return {
                ...state,
                userProfileName: action.data,
            };

        case USER_PASSWORD:
            return {
                ...state,
                userAccountPassword: action.data,
            };

        case USER_PHONE:
            return {
                ...state,
                userPhoneNumber: action.data,
            };

        case USER_USERNAME:
            return {
                ...state,
                userUserName: action.data,
            };

        default:
            return state;
    }
};

export default user;
