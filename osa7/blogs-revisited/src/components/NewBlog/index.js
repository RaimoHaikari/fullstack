/* eslint-disable linebreak-style */
import React, { useState, useImperativeHandle, forwardRef } from 'react'

import {
  FormContainer,
  Input,
  Submit
} from './newBlogStyle'

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
    <FormContainer>


      <form onSubmit={addBlog}>
        <h3 style={{
          marginBottom: '10px',
          marginTop: '10px'
        }}>Create new</h3>


        <label htmlFor="blogAppNewBlogTitle">title</label>
        <Input
          id='blogAppNewBlogTitle'
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder='title of the blog'
        />


        <label htmlFor="blogAppNewBlogAuthor">author</label>
        <Input
          id='blogAppNewBlogAuthor'
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='author of the blog'
        />



        <label htmlFor="blogAppNewBlogUrl">url</label>
        <Input
          id='blogAppNewBlogUrl'
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder='url of the blog'
        />


        <div style={{ marginBottom: '10px' }}>
          <Submit type="submit" value="Submit"></Submit>

        </div>

      </form>
    </FormContainer>
  )
})

NewBlog.displayName = 'NewBlogForm'

export default NewBlog