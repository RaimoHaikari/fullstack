/* eslint-disable linebreak-style */
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import loginService from '../services/login'
import blogService from '../services/blogs'

import { setUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'

const LoginForm = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (event) => {

    event.preventDefault()

    try {

      const user = await loginService
        .login({ username, password })

      window.localStorage.setItem(
        'loggedBlogsAppUser',
        JSON.stringify(user)
      )

      dispatch(setUser(user))

      blogService.setToken(user.token)

      dispatch(setNotification({
        message: `Tervetuloa ${user.name}`,
        success: true
      }))

      clearUserData()

    } catch (e) {

      dispatch(setNotification({
        message:  'Kirjautuminen epäonnistui.',
        success: false
      }))

      clearUserData()
    }
  }

  const clearUserData = () => {
    setUsername('')
    setPassword('')
  }

  return (

    <form
      onSubmit={handleLogin}
      id="blogAppLoginForm"
    >
      <div>
            username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          placeholder="tilli"
          id="blogAppLoginFormUsernameField"
        />
            password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          placeholder="accad"
          id="blogAppLoginFormPasswordField"
        />
      </div>

      <button
        type="submit"
        id="blogAppLoginFormSubmitButton"
      >Login</button>

    </form>
  )
}

export default LoginForm