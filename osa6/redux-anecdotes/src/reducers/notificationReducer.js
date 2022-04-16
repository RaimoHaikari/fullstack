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
export default notificationSlice.reducer;