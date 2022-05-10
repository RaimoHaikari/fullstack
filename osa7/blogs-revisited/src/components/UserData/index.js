/* eslint-disable linebreak-style */
import { useDispatch, useSelector } from 'react-redux'

import { clearUser } from '../../reducers/userReducer'
import { setNotification } from '../../reducers/notificationReducer'

import { StyledLink, UnicornButton,  UnicornSystemsLinkBar } from './userDataStyles'

const UserData = ({ localStorageItemName }) => {

  /*
  const divStyle = {
    marginTop: 10,
    borderBottom: '1px solid navy'
  }

  const linkPadding = {
    padding: 3,
    textDecoration: 'none'
  }
  */

  const dispatch = useDispatch()

  const { name } = useSelector(state => state.user)

  const handleLogout = () => {

    window.localStorage.removeItem(localStorageItemName)

    dispatch(clearUser())

    dispatch(setNotification({
      message: 'Käyttäjä kirjautui ulos',
      success: true
    }))


  }

  return (
    <UnicornSystemsLinkBar>

      <StyledLink to="/">Home</StyledLink>
      <StyledLink to="/blogs">Blogs</StyledLink>
      <StyledLink to="/users">Users</StyledLink>

      <span style={{ marginLeft: '20px' }}>
        {name} logged in
        <UnicornButton
          onClick={handleLogout}
          style={{ marginLeft: '10px', marginBottom: '5px' }}
        >
        Logout
        </UnicornButton>
      </span>
    </UnicornSystemsLinkBar>
  )
}

export default UserData