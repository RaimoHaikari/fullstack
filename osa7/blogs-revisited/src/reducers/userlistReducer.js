/* eslint-disable linebreak-style */
/* eslint-disable indent */
import { createSlice } from '@reduxjs/toolkit'

import userlistService from '../services/users'

const initialState = []

const userListSorter = (a, b) => {

    if(a.nOfBlogs > b.nOfBlogs)
      return -1

    if(a.nOfBlogs < b.nOfBlogs)
      return 1

    return 0
}

const userlistSlice = createSlice({
    name: 'userlist',
    initialState,
    reducers: {
        setUserlist(state, action) {

            return action.payload
              .map(user => {
                  const nOfBlogs = user.blogs.length

                  return {
                      ...user,
                      nOfBlogs: nOfBlogs
                  }
              })
              .sort(userListSorter)

        },
        clearUserlist() {
            return initialState
        }
    }
})

export const { clearUserlist, setUserlist } = userlistSlice.actions

/*
 * Haetaan blogit kannasta ja laitetaan tietolaariin näkösälle.
 */
export const fetchUserlist = () => {

    return async dispatch => {

        const allTheUsers = await userlistService.getAll()
        dispatch(setUserlist(allTheUsers))

    }
}

export default userlistSlice.reducer
