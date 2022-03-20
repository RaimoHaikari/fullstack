/* eslint-disable linebreak-style */
import React, { useState, useImperativeHandle, forwardRef } from 'react'

/*
 * - pari forwarRef & ref mahdollistavat komponentin sisältämien funktioiden
 *   käyttämisen komponentin ulkopuolelta
 */
const Togglable = forwardRef((props, ref) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none': '' }
  const showWhenVisible = { display: visible ? '': 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  /*
    * luodaan kompontin ulkopuolelta käytettävissä oleva linkki toggleVisibility -funktioon
    */
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div style={{
      borderTop: '1px dotted gray',
      paddingTop: '10px',
      borderBottom: '1px dotted gray',
      paddingBottom: '10px'
    }}>

      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>

      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>

    </div>
  )

})

Togglable.displayName = 'Togglable'

export default Togglable