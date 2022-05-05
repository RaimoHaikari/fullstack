/* eslint-disable linebreak-style */
import React from 'react'

import { useSelector } from 'react-redux'

/*
 * 5.4: blogilistan frontend, step4
 * - Toteuta sovellukseen notifikaatiot, jotka kertovat sovelluksen yläosassa
 *   onnistuneista ja epäonnistuneista toimenpiteistä
 */
const Notification = () => {

  const { message, success } = useSelector(state => state.notification)

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

export default Notification