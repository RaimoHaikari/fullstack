/* eslint-disable linebreak-style */
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'

const UserList = () => {

  const tableStyle = {
    fontFamily: 'arial, sans-serif',
    borderCollapse: 'collapse'
  }

  const cellStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px'
  }

  const { listOfUsers, loggedUser } = useSelector(state => {

    const _loggedUser = state.user.username !== null ? true : false

    return {
      listOfUsers: state.userlist,
      loggedUser: _loggedUser
    }
  })

  const getUsers = () => {

    return (
      <React.Fragment>
        <h2>Users</h2>
        <table style={tableStyle}>
          <tr>
            <th style={cellStyle}>Nimi</th>
            <th style={cellStyle}>Blogien määrä</th>
          </tr>
          {
            listOfUsers.map(user => {
              return(
                <tr key={user.id}>
                  <td style={cellStyle}>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </td>
                  <td style={cellStyle}>{user.blogs.length}</td>
                </tr>
              )
            })
          }
        </table>
      </React.Fragment>

    )

  }


  return (
    <React.Fragment>
      {
        loggedUser
          ? getUsers()
          : <Navigate replace to="/" />
      }
    </React.Fragment>
  )
}

export default UserList