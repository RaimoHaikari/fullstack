/* eslint-disable linebreak-style */
import { useState } from 'react'

import propTypes from 'prop-types'

import blogService from '../services/blogs'

import TextAndButton from './TextAndButton'

const Blog = ({ blog, messageHandler, removeBtnHandler }) => {

  const titleSpanStyle = {
    fontWeight: 'bolder'
  }

  const dStyle = {
    marginBottom: '15px'
  }

  const pStyle = {
    margin: '0',
    padding: '2px',
  }

  const [isExpanded, setExpanded] = useState(blog.expanded)
  const [likeCount, setLikeCount] = useState(blog.likes)

  /*
   *
   */
  const longSheet = () => {
    return (
      <div style={dStyle}>

        <TextAndButton
          btlLabel = {isExpanded ? 'hide' : 'view'}
          btnHandler = {() => setExpanded(!isExpanded)}
        >
          <span style={titleSpanStyle}>{`${blog.title} [${blog.author}]`}</span>
        </TextAndButton>

        <p style={pStyle}>{blog.url}</p>

        <TextAndButton
          btlLabel = "like"
          btnHandler = {likeButtonHandler}
        >
          <span>{`likes ${likeCount}`}</span>
        </TextAndButton>

        <p style={pStyle}>{`was added by: ${blog.user.name}`}</p>

        {
          blog.ownerOfBlog
            ?
            <TextAndButton
              btlLabel = "remove"
              btnHandler = {() => removeBtnHandler(blog)}
            />
            : null
        }

      </div>
    )
  }

  const shortSheet = () => {
    return (
      <div style={dStyle}>
        <TextAndButton
          btlLabel = {isExpanded ? 'hide' : 'view'}
          btnHandler = {() => setExpanded(!isExpanded)}
        >
          <span style={titleSpanStyle}>{`${blog.title}`}</span>
        </TextAndButton>
      </div>
    )
  }

  /*
   * displayMessage(false, 'Kirjautuminen epäonnistui.');
   */
  const likeButtonHandler = async () => {

    try {

      const newLikeCount = likeCount + 1

      const updatedBlog = {
        ...blog,
        likes: newLikeCount
      }

      await blogService.update(updatedBlog)

      setLikeCount(newLikeCount)
      messageHandler(true, 'Tykkään, tykkään, tykkään....')

    } catch (exception) {

      console.log('Tykkäys ei onnistunut')
      console.log(exception)

      messageHandler(false, `${exception.response.data.error}`)

    }
  }

  return(
    <>
      {
        isExpanded
          ? longSheet()
          : shortSheet()
      }
    </>
  )
}

Blog.propTypes = {
  blog: propTypes.object.isRequired,
  messageHandler: propTypes.func.isRequired,
  removeBtnHandler: propTypes.func.isRequired
}

export default Blog