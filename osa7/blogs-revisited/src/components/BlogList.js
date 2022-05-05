/* eslint-disable linebreak-style */
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'

import { setNotification } from '../reducers/notificationReducer'
import { createNewBlog } from '../reducers/blogsReducer'

import Togglable from './Togglable'
import NewBlog from './NewBlog'

const BlogList = () => {

  const ulStyle = {
    listStyleType: 'none',
    padding: '0',
    marginTop: '10px'
  }

  const listItemStyle = {
    padding: '5px',
    borderBottom: '1px dotted gray'
  }

  /*
    * - ref menkanismin avulla saadaan yhteys toisen komponentin sisällä
    *   olevaan funktioon
    */
  const togglableRef = useRef()
  const blogFormRef = useRef()

  const dispatch = useDispatch()

  const { blogs, loggedUser } = useSelector(state => {

    const _blogs = state.blogs
    const _loggedUser = state.user.username !== null ? true : false

    return {
      blogs: _blogs,
      loggedUser: _loggedUser
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
      <ul style={ulStyle}>
        {
          blogs.map(blog => {
            return (
              <li style={listItemStyle} key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </li>
            )
          })
        }
      </ul>
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
            ? <h3>Sovellukseen on lisätty seuravat blogit</h3>
            : <p>Ei lisättyjä blogeja</p>
        }
        { getBlogs() }
        { addNewBlog() }
      </>
    )
  }


  return (
    <>
      {
        loggedUser
          ? loggedUserScreen()
          : <Navigate replace to="/" />
      }
    </>
  )
}

export default BlogList