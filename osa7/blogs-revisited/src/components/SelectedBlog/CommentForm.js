/* eslint-disable linebreak-style */
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { addComment } from '../../reducers/blogsReducer'
import { setNotification } from '../../reducers/notificationReducer'

import { CommentFormButton } from './selectedBlogStyles'

const CommentForm = ( { blogId } ) => {

  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const handleSubmit = async (event) => {

    event.preventDefault()

    try {

      dispatch(addComment(blogId, comment))

      dispatch(setNotification({
        message: 'Kiitos kommentistasi!',
        success: true
      }))

      clearData()

    } catch (exception) {

      dispatch(setNotification({
        message: `Kommentointi ei onnistunut: ${exception.response.data.error}`,
        success: false
      }))

      clearData()

    }

  }

  const clearData = () => {
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        style={{ padding: '12px 20px' }}
        type="text"
        value={comment}
        name="Comment"
        onChange={({ target }) =>  setComment(target.value)}
      />
      <CommentFormButton
        type="submit"
      >add comment</CommentFormButton>
    </form>
  )
}

export default CommentForm