/* eslint-disable linebreak-style */
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setNotification } from '../reducers/notificationReducer'
import { deleteBlog, updateBlog } from '../reducers/blogsReducer'

import TextAndButton from './TextAndButton'
import React from 'react'

const SelectedBlog = () => {

  const id = useParams().id

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { blog, loggedUser } = useSelector(state => {

    const filteredBlog = state.blogs.filter(blog => blog.id === id)
    const _loggedUser = state.user.username !== null ? true : false

    let blogObj = null

    if(filteredBlog.length === 1){

      const owner= filteredBlog[0].user.username
      const currentUser = state.user.username

      const viewRemoveBtn = owner === currentUser
        ? true
        : false

      blogObj = {
        ...filteredBlog[0],
        ownerOfBlog: viewRemoveBtn
      }
    }

    return {
      blog: blogObj,
      loggedUser: _loggedUser
    }
  })

  const displayDataSheet = () => {

    return (
      <div>
        <h3>{blog.title}</h3>

        <p><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>

        <TextAndButton
          btlLabel = "like"
          btnHandler = {handleLike}
          id={`like_btn_${blog.id}`}
        >
          <span className='blogAppBlogLikeCount'>{`likes ${blog.likes}`}</span>
        </TextAndButton>

        <p>{`was added by: ${blog.user.name}`}</p>


        {
          blog.ownerOfBlog
            ?
            <TextAndButton
              btlLabel = "remove"
              btnHandler = {handleRemove}
              id={`remove_btn_${blog.id}`}
            />
            : null
        }

      </div>
    )
  }


  /*
    * Blogin liketys...
    */
  const handleLike = async () => {

    try {

      const newLikeCount = blog.likes + 1

      const updatedBlog = {
        ...blog,
        likes: newLikeCount
      }

      dispatch(updateBlog(updatedBlog))

      dispatch(setNotification({
        message: 'Kiva kun tykkäsit vinkistä',
        success: true
      }))


    } catch (exception) {

      dispatch(setNotification({
        message: `Tykkäys ei onnistunut: ${exception.response.data.error}`,
        success: false
      }))

    }

  }


  /*
    * Blogin poisto
    */
  const handleRemove = () => {

    try {

      const msg = `Remove blog ${blog.title} by ${blog.author}`
      const val = window.confirm(msg)

      if(val !== true)
        return

      dispatch(deleteBlog(blog))

      dispatch(setNotification({
        message: `${blog.title} poistettiin`,
        success: true
      }))

      navigate('/')


    } catch (exception) {

      dispatch(setNotification({
        message: `${blog.title} poistettiin`,
        success: false
      }))

    }

  }

  /*
   *
   */
  return (
    <React.Fragment>
      {
        loggedUser
          ?
          blog !== null
            ? displayDataSheet()
            : <Navigate replace to="/blogs" />
          : <Navigate replace to="/" />
      }
    </React.Fragment>
  )
}

export default SelectedBlog