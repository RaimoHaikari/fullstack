/* eslint-disable linebreak-style */
import React from 'react'
import { useSelector } from 'react-redux'

import { Container, Heading } from '../../globalStyles'
import { Table, StyledLink } from './userListStyle'

const UserList = () => {


  const cellStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px'
  }

  const { listOfUsers } = useSelector(state => {
    return {
      listOfUsers: state.userlist
    }
  })

  const numbersToUnicorns = (n) => {
    let x = ''

    for(let i  = 0; i < n; i++) {
      x = x + ' 🦄'
    }

    return x
  }

  const getUsers = () => {

    return (
      <Container>
        <Heading>Users of Unicorn Systems</Heading>
        <Table>
          <tr>
            <th style={cellStyle}>Nimi</th>
            <th style={cellStyle}>Credits in Unicorns</th>
          </tr>
          {
            listOfUsers.map(user => {
              return(
                <tr key={user.id}>
                  <td style={cellStyle}>
                    <StyledLink to={`/users/${user.id}`}>{user.name}</StyledLink>
                  </td>
                  <td style={cellStyle}>{numbersToUnicorns(user.blogs.length)}</td>
                </tr>
              )
            })
          }
        </Table>
      </Container>

    )

  }


  return (
    <>
      {
        getUsers()
      }
    </>
  )
}

export default UserList