/* eslint-disable */
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import loginService from '../../services/login'
import blogService from '../../services/blogs'

import { setUser } from '../../reducers/userReducer'
import { setNotification } from '../../reducers/notificationReducer'

import { Div, ButtonAsLink } from './loginFormStyles'

const LoginForm = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const passwordWhisperer = () => {
    window.alert('user\tpassword\n.......................\ntilli\taccad\nebba\taccad')
  }
 
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

    <Div>
      <div className='row'>
        <form
          onSubmit={handleLogin}
          id="blogAppLoginForm"
        >
          <label htmlFor="blogAppLoginFormUsernameField">Username</label>
          <input
            type="text"
            value={username}
            id="blogAppLoginFormUsernameField"
            onChange={({ target }) => setUsername(target.value)}
            name="Username"
            placeholder="tilli"
          />
          <label htmlFor="blogAppLoginFormPasswordField">Password</label>
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            placeholder="accad"
            id="blogAppLoginFormPasswordField"
          />
          <input type="submit" value="Login" />

        </form>
        <p>
          <ButtonAsLink
            onClick={passwordWhisperer}
          >Unohtuiko salasana</ButtonAsLink>
        </p>
      </div>
    </Div>
  )
}

export default LoginForm