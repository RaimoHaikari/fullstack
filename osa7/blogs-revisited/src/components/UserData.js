/* eslint-disable linebreak-style */
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { clearUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'

const UserData = ({ localStorageItemName }) => {

  const divStyle = {
    marginTop: 10,
    borderBottom: '1px solid navy'
  }

  const linkPadding = {
    padding: 3,
    textDecoration: 'none'
  }

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
    <div style={divStyle}>

      <Link style={linkPadding} to="/">Home</Link>
      <Link style={linkPadding} to="/blogs">Blogs</Link>
      <Link style={linkPadding} to="/users">Users</Link>

      <span style={{ marginLeft: '20px' }}>
        {name} logged in
        <button
          onClick={handleLogout}
          style={{ marginLeft: '10px', marginBottom: '5px' }}
        >
        Logout
        </button>
      </span>
    </div>
  )
}

export default UserData