/* eslint-disable linebreak-style */
import React from 'react'

import propTypes from 'prop-types'

const UserData = ({ logoutHandler, name }) => {

  return (
    <div>
      {name} logged in
      <button
        onClick={logoutHandler}
        style={{ marginLeft: '10px' }}
      >
      Logout
      </button>
    </div>
  )
}

UserData.propTypes = {
  logoutHandler: propTypes.func.isRequired,
  name: propTypes.string.isRequired
}

export default UserData