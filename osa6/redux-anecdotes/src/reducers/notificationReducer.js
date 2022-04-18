import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: null
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        displayNotification(state, action){
            const msg = action.payload;

            const newState = {
                ...state,
                message: msg
            };

            return newState
        },
        clearNotification(state, action){
            return initialState
        }
    }
});

export const {displayNotification, clearNotification} = notificationSlice.actions;

/*
 * 6.18 anekdootit ja backend, step6
 */
export const setNotification = (message, duration) => {

    return async dispatch => {

        dispatch(displayNotification(message));

        setTimeout(() => {
            dispatch(clearNotification())
        }, duration * 1000);
    }
}


export default notificationSlice.reducer;