/* eslint-disable linebreak-style */
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// '../reducers/notificationReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { deleteBlog, updateBlog } from '../../reducers/blogsReducer'

import {
  Container,
  Heading,
  Section
} from '../../globalStyles'

import { UL, LI } from './selectedBlogStyles'

import TextAndButton from '../TextAndButton'
import CommentForm from './CommentForm'

import React from 'react'

const SelectedBlog = () => {

  const id = useParams().id

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { blog, comments } = useSelector(state => {

    const filteredBlog = state.blogs.filter(blog => blog.id === id)

    let blogObj = null
    let comments = []

    if(filteredBlog.length === 1){

      const owner= filteredBlog[0].user.username
      const currentUser = state.user.username

      const viewRemoveBtn = owner === currentUser
        ? true
        : false

      comments = filteredBlog[0].comments

      blogObj = {
        ...filteredBlog[0],
        ownerOfBlog: viewRemoveBtn
      }
    }

    return {
      blog: blogObj,
      comments: comments
    }
  })

  const addCommentsSection = () => {

    return (
      <React.Fragment>
        {
          comments.length > 0 ? <h3>Comments</h3> : <p>Blog doesn&apos;t have any comments</p>
        }
        <UL>
          {
            comments.map(c => {
              return (
                <LI key={c.id}>{c.content}</LI>
              )
            })
          }
        </UL>

        <CommentForm
          blogId = {blog.id}
        />

      </React.Fragment>
    )
  }

  const displayDataSheet = () => {

    return (
      <Container>

        <Heading>{blog.title}</Heading>

        <Section>

          <p style={{ marginBottom: '10px' }}><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>

          <TextAndButton
            btlLabel = "like"
            btnHandler = {handleLike}
            id={`like_btn_${blog.id}`}
          >
            <span className='blogAppBlogLikeCount'>{`likes ${blog.likes}`}</span>
          </TextAndButton>

          <p style={{ margin: '10px 0' }}>
          was added by
            <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{blog.user.name}</span>
          </p>

          {
            blog.ownerOfBlog
              ?
              <p style={{ margin: '10px 0 20px 0' }}>
                <TextAndButton
                  btlLabel = "remove blog"
                  btnHandler = {handleRemove}
                  id={`remove_btn_${blog.id}`}
                />
              </p>
              : null
          }

          {
            addCommentsSection()
          }

        </Section>

      </Container>
    )
  }

  /*
  const handleAddComment = async () => {
    console.log("Titi tyy")
  }
  */


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
        blog !== null
          ? displayDataSheet()
          : null
      }
    </React.Fragment>
  )
}

export default SelectedBlog