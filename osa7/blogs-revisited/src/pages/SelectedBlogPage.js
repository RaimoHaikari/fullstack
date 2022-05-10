/* eslint-disable linebreak-style */
import {  useSelector } from 'react-redux'

import SelectedBlog from '../components/SelectedBlog'

const SelectedBlogPage = () => {

  const { loggedUser } = useSelector(state => {

    const _loggedUser = state.user.username !== null ? true : false

    return {
      loggedUser: _loggedUser
    }
  })

  return (
    <>
      {
        loggedUser
          ? <SelectedBlog />
          : null
      }
    </>
  )
}

export default SelectedBlogPage