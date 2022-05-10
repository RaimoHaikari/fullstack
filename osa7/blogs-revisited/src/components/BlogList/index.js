/* eslint-disable linebreak-style */
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//import { Link } from 'react-router-dom'

import { setNotification } from '../../reducers/notificationReducer'
import { createNewBlog } from '../../reducers/blogsReducer'

import { Container, Heading } from '../../globalStyles'
import { UL, LI, StyledLink } from './blogListStyles'

import Togglable from '../Togglable'
import NewBlog from '../NewBlog'

const BlogList = () => {

  /*
    * - ref menkanismin avulla saadaan yhteys toisen komponentin sisällä
    *   olevaan funktioon
    */
  const togglableRef = useRef()
  const blogFormRef = useRef()

  const dispatch = useDispatch()

  const { blogs } = useSelector(state => {

    const _blogs = state.blogs

    return {
      blogs: _blogs
    }
  })



  const addNewBlog = () => {

    return (

      <Togglable buttonLabel="Add new.." ref={togglableRef}>

        <NewBlog
          createBlog = {handleAddNew}
          ref = {blogFormRef}
        />

      </Togglable>
    )

  }

  const getBlogs = () => {

    return (
      <UL>
        {
          blogs.map(blog => {
            return (
              <LI key={blog.id}>
                <StyledLink to={`/blogs/${blog.id}`}>{blog.title}</StyledLink>
              </LI>
            )
          })
        }
      </UL>
    )
  }




  /*
    * Uuden blogin lisäys
    */
  const handleAddNew = newBlog => {

    try {

      dispatch(createNewBlog(newBlog))

      dispatch(setNotification({
        message: `A new blog: ${newBlog.title} by ${newBlog.author} added`,
        success: true
      }))

      /* - suljetaan ja tyhjennetään blogitietojen syöttölomake */
      togglableRef.current.toggleVisibility()
      blogFormRef.current.clearBlogData()


    } catch (exception) {

      dispatch(setNotification({
        message: 'Adding failed. Check that your data is correct',
        success: true
      }))

    }

  }

  const loggedUserScreen = () => {
    return(
      <>
        {
          blogs.length > 0
            ? <Heading>Sovellukseen on lisätty seuravat ihanat blogit</Heading>
            : <p>Ei lisättyjä blogeja</p>
        }
        { getBlogs() }
        { addNewBlog() }
      </>
    )
  }


  return (
    <Container>
      {
        loggedUserScreen()
      }
    </Container>
  )
}

export default BlogList