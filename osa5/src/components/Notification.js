/* eslint-disable linebreak-style */
import React from 'react'
import propTypes from 'prop-types'

/*
 * 5.4: blogilistan frontend, step4
 * - Toteuta sovellukseen notifikaatiot, jotka kertovat sovelluksen yläosassa
 *   onnistuneista ja epäonnistuneista toimenpiteistä
 */
const Notification = ({ message, success }) => {
  return (
    <div style={
      {
        background: success ? 'green' : 'red',
        color: 'white',
        padding: '10px 10px',
        marginBottom: '5px'
      }
    }
    id="blogAppNoticationDiv"
    >
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: propTypes.string.isRequired,
  success: propTypes.bool.isRequired
}

export default Notification