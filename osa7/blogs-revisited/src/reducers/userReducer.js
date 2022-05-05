/* eslint-disable linebreak-style */
/* eslint-disable indent */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: null,
    token: null,
    username: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            const { name, token, username } = action.payload

            const newState = {
                ...state,
                name,
                token,
                username
            }

            return newState
        },
        clearUser() {
            return initialState
        }
    }
})

export const { clearUser, setUser } = userSlice.actions

export default userSlice.reducer
