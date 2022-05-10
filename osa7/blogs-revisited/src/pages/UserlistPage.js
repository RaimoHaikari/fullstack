/* eslint-disable linebreak-style */
import { useSelector } from 'react-redux'

import UserList from '../components/UserList'

const UserlistPage = () => {

  const { loggedUser } = useSelector(state => {

    const _loggedUser = state.user.username !== null ? true : false

    return {
      loggedUser: _loggedUser
    }
  })

  //  <Navigate replace to="/" />
  return (
    <>
      {
        loggedUser
          ? <UserList />
          : null
      }
    </>
  )
}

export default UserlistPage