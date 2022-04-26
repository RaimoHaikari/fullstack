import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: null,
    running: false,
    id: null
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        displayNotification(state, action){
            const {msg, timeoutId} = action.payload;

            const newState = {
                ...state,
                message: msg,
                running: true,
                id: timeoutId
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
 * - toteuta action creator, joka mahdollistaa notifikaation antamisen seuraavasti....
 *
 * 6.21 anekdootit, loppuhuipennus
 * - ... korjaa bugi siten, että usean peräkkäisen äänestyksen viimeistä notifikaatiota näytetään 
 *   aina viiden sekunnin ajan.
 */
export const setNotification = (message, duration) => {

    return async (dispatch, state) => {

        // testaa onko jo juoksemassa
        let timerRunning = state().notification.running;
        let timerId = state().notification.id;

        if(timerRunning) {
            clearTimeout(timerId);
            dispatch(clearNotification());
        } 


        let timeoutId = setTimeout(() => {
            dispatch(clearNotification({}))
        }, duration * 1000);

        dispatch(displayNotification({
            msg: message,
            timeoutId: timeoutId
        }));
    }
}


export default notificationSlice.reducer;