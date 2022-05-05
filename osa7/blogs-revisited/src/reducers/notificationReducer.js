/* eslint-disable linebreak-style */
/* eslint-disable indent */

/*
 *  Redux Toolkitin avulla reducerin ja siihen liittyvät action creatorit voi luoda kätevästi createSlice-funktion avulla.
 */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: null,
    success: null,
    running: false,
    id: null
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        displayNotification(state, action) {

            const { msg, success, timoutId } = action.payload

            const newState = {
                ...state,
                message: msg,
                running: true,
                success: success,
                id: timoutId
            }

            return newState
        },
        clearNotification() {
            return initialState
        }
    }
})

export const setNotification = (msgObj,  duration = 2) => {

    return async (dispatch, state) => {


        const { message, success } = msgObj

        // Näytetäänkö näytöllä jo jotain?
        let timerRunning = state().notification.running
        let timerId = state().notification.id

        // Nollataan tarvittaessa aikaisempi viesti
        if(timerRunning) {
            clearTimeout(timerId)
            dispatch(clearNotification())
        }

        // Käynnistyvän laskurin id talteen
        let timeoutId =  setTimeout(() => {
            dispatch(clearNotification())
        }, duration * 1000)

        dispatch(displayNotification({
            msg: message,
            timeoutId: timeoutId,
            success: success
        }))

    }
}

export const { displayNotification, clearNotification } = notificationSlice.actions

export default notificationSlice.reducer