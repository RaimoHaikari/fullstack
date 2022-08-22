/* eslint-disable linebreak-style */
import React from 'react'

import propTypes from 'prop-types'

const LoginForm = ({ password, passwordChangeHandler, username, usernameChangeHandler, submitHanler }) => {

  return (

    <form
      onSubmit={submitHanler}
      id="blogAppLoginForm"
    >
      <div>
            username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => usernameChangeHandler(target.value)}
          placeholder="tilli"
          id="blogAppLoginFormUsernameField"
        />
            password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => passwordChangeHandler(target.value)}
          placeholder="accad"
          id="blogAppLoginFormPasswordField"
        />
      </div>

      <button
        type="submit"
        id="blogAppLoginFormSubmitButton"
      >Login</button>

      <p>Kirjautumaan pääsee tunnuksilla:</p>

      <table>
        <tbody>
          <tr>
            <th>username</th>
            <th>password</th>
          </tr>
          <tr>
            <td>tilli</td>
            <td>accad</td>
          </tr>
          <tr>
            <td>ebba</td>
            <td>accad</td>
          </tr>
          <tr>
            <td>mluukkai</td>
            <td>salainen</td>
          </tr>
        </tbody>

      </table>

    </form>
  )
}

LoginForm.propTypes = {
  password: propTypes.string.isRequired,
  passwordChangeHandler: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
  usernameChangeHandler: propTypes.func.isRequired,
  submitHanler: propTypes.func.isRequired,
}

export default LoginForm