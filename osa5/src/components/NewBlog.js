/* eslint-disable linebreak-style */
import React, { useState, useImperativeHandle, forwardRef } from 'react'

const NewBlog = forwardRef(({ createBlog }, ref) => {

  /*
  * 5.6 blogilistan frontend, step6
  * - Eriytä uuden blogin luomisesta huolehtiva lomake omaan komponenttiins
  *   (jos et jo ole niin tehnyt), ja siirrä kaikki uuden blogin luomiseen
  *   liittyvä tila komponentin vastuulle.
  */
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  /*
  * - välitetään komponentin ulkopuolelle viittaus syöttökenttien
  *   arvot tyhjentävään funktioon
  */
  useImperativeHandle(ref, () => {
    return {
      clearBlogData
    }
  })

  const addBlog = (event) => {

    event.preventDefault()
    createBlog({ title,author,url })

  }

  const clearBlogData = () => {

    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (
    <form onSubmit={addBlog}>
      <h3 style={{
        marginBottom: '10px',
        marginTop: '10px'
      }}>Create new</h3>

      <div style={{ marginBottom: '10px' }}>
                title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />

      </div>

      <div style={{ marginBottom: '10px' }}>
                author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button type='submit'>Create</button>
      </div>

    </form>
  )
})

NewBlog.displayName = 'NewBlogForm'

export default NewBlog