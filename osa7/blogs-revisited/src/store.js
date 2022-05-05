/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import blogsReducer from './reducers/blogsReducer'
import userlistReducer from './reducers/userlistReducer'


const store = configureStore({
    reducer: {
        user: userReducer,
        notification: notificationReducer,
        blogs: blogsReducer,
        userlist: userlistReducer
    }
})

export default store
