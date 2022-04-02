/* eslint-disable linebreak-style */
import React from 'react'

/*
 * 5.7* blogilistan frontend, step7
 * - nappi, jonka avulla voi kontrolloida, näytetäänkö kaikki blogiin liittyvät tiedot
 * - Napin like ei tässä vaiheessa tarvitse tehdä mitään.
 */
const TextAndButton = (props) => {

  const { btnHandler, btlLabel } = props

  return (
    <div className='textAndButton'>
      {props.children}
      <button
        id={typeof props.id === 'undefined' ? null : props.id}
        onClick={btnHandler}
        style={ typeof props.children !== 'undefined' ? { marginLeft: '10px' } : null}
      >{btlLabel}</button>
    </div>
  )
}

export default TextAndButton