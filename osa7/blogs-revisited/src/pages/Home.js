/* eslint-disable linebreak-style */
import React from 'react'
import { useSelector } from 'react-redux'

import Hero from '../components/Hero/Hero'

const Home = () => {

  const {
    loggedUser
  } = useSelector(state => {

    const _loggedUser = state.user.username !== null ? true : false

    return {
      loggedUser: _loggedUser
    }

  })

  return (
    <React.Fragment>
      {
        loggedUser === true
          ? <Hero />
          : null
      }
    </React.Fragment>
  )
}

export default Home