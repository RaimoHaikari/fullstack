/* eslint-disable linebreak-style */
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  Container,
  Heading,
  Section
} from '../../globalStyles'

import { UL, LI } from './selectedUserStyle'

const SelectedUser = () => {

  const id = useParams().id


  const { user } = useSelector(state => {

    const filteredUser = state.userlist.filter(user => user.id === id)

    let userObj = null


    if(filteredUser.length === 1){

      userObj = {
        ...filteredUser[0],
      }

    }

    return {
      user: userObj
    }
  })

  const displayDataSheet = () => {

    return (
      <Container>
        <Heading>{user.name}</Heading>

        <Section>


          {
            user.blogs.length > 0
              ? <p>added blogs:</p>
              : <p>hasn`&pos;` added any blogs yet</p>
          }

          <UL>
            {
              user.blogs.map(blog => {
                return (
                  <LI key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title}
                    </Link>
                  </LI>
                )
              })
            }
          </UL>

        </Section>
      </Container>
    )
  }

  // <Navigate replace to="/users" />
  return (
    <>
      {
        user !== null
          ? displayDataSheet()
          : null
      }
    </>
  )
}

export default SelectedUser