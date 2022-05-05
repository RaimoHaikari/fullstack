/* eslint-disable linebreak-style */
import { Link } from 'react-router-dom'

const LinkBar = () => {

  const divStyle = {
    marginTop: 10,
    borderBottom: '1px solid navy'
  }

  const linkPadding = {
    padding: 5,
    textDecoration: 'none'
  }

  return (
    <div style={divStyle}>
      <Link style={linkPadding} to="/">Home</Link>
      <Link style={linkPadding} to="/blogs">Blogs</Link>
      <Link style={linkPadding} to="/users">Users</Link>
    </div>
  )
}

export default LinkBar