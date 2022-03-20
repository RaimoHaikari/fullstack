/* eslint-disable linebreak-style */
import React from 'react'

import propTypes from 'prop-types'

const LoginForm = ({ password, passwordChangeHandler, username, usernameChangeHandler, submitHanler }) => {

  return (

    <form
      onSubmit={submitHanler}
    >
      <div>
            username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => usernameChangeHandler(target.value)}
        />
            password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => passwordChangeHandler(target.value)}
        />
      </div>

      <button type="submit">Login</button>

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