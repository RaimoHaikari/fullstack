/* eslint-disable linebreak-style */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Routes,
  Route
} from 'react-router-dom'

import Home from './pages/Home'
import BloglistPage from './pages/BloglistPage'
import SelectedBlogPage from './pages/SelectedBlogPage'
import UserlistPage from './pages/UserlistPage'
import SelectedUserPage from './pages/SelectedUserPage'


import LoginForm from './components/LoginForm'
import UserData from './components/UserData'
import Notification from './components/Notification'

import blogService from './services/blogs'

import { setUser } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import { fetchBlogs } from './reducers/blogsReducer'
import { fetchUserlist } from './reducers/userlistReducer'

const App = () => {

  const LOCAL_STORAGE_ITEM_NAME = 'loggedBlogsAppUser'

  /* R E D U X  - t o i m i n n a l l i s u u s */
  const dispatch = useDispatch()

  const {
    displayNotification,
    loggedUser
  } = useSelector(state => {

    const _displayNotification = state.notification.message !== null ? true : false
    const _loggedUser = state.user.username !== null ? true : false

    return {
      loggedUser: _loggedUser,
      displayNotification: _displayNotification,
    }

  })

  /*
   * Haetaan blogit ja käyttäjät kannasta tietovarastoon.
   */
  useEffect(() => {
    dispatch(fetchBlogs())
    dispatch(fetchUserlist())
  }, [])

  /*
   * Tsekataan onko kirjautumistiedot talletettu localStorageen
   */
  useEffect(() => {

    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser')

    if(loggedUserJSON){

      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)

      dispatch(setUser(user))
      dispatch(setNotification({
        message: `Tervetuloa takaisin ${user.name}`,
        success: true
      }))

    }
  }, [])




  const displayLoginIfNeeded = () => {
    return (
      <React.Fragment>
        {
          loggedUser === false
            ?
            <LoginForm />
            :
            <UserData localStorageItemName = {LOCAL_STORAGE_ITEM_NAME} />
        }
      </React.Fragment>
    )
  }



  return (
    <div>

      {
        displayNotification === false
          ?
          null
          :
          <Notification />
      }

      {
        displayLoginIfNeeded()
      }

      <Routes>
        <Route path="/users/:id" element={<SelectedUserPage />} />
        <Route path="/users" element={<UserlistPage />} />
        <Route path="/blogs/:id" element={<SelectedBlogPage />} />
        <Route path="/blogs" element={<BloglistPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
