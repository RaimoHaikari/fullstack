/* eslint-disable linebreak-style */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from '../components/NewBlog'

describe('<NewBlog />', () => {

  const newBlogObj = {
    title: 'Mies tulee räkänokastakin',
    author: 'A-P',
    url: 'www.vainiin.com'
  }

  const createBlogHandler = jest.fn()

  // eslint-disable-next-line no-unused-vars
  let newBlogComponent

  beforeEach(() => {

    newBlogComponent = render(
      <NewBlog
        createBlog={createBlogHandler}
        ref={null}
      />
    )

  })


  /*
   * 5.16: blogilistan testit, step4
   * - Tee uuden blogin luomisesta huolehtivalle lomakkelle testi, joka varmistaa,
   *   että lomake kutsuu propseina saamaansa takaisinkutsufunktiota oikeilla tiedoilla
   *   siinä vaiheessa kun blogi luodaan.
   */
  test('NewBlog komponetti välittää oikeat tiedot eteenpäin', () => {

    const titleBox = screen.getByPlaceholderText('title of the blog')
    userEvent.type(titleBox, newBlogObj.title)

    const authorBox = screen.getByPlaceholderText('author of the blog')
    userEvent.type(authorBox, newBlogObj.author)

    const urlBox = screen.getByPlaceholderText('url of the blog')
    userEvent.type(urlBox, newBlogObj.url)

    const sendButton = screen.getByText('Create')
    userEvent.click(sendButton)

    // - tapahtumaan on reagoitu
    expect(createBlogHandler.mock.calls).toHaveLength(1)

    // - vastaanotettu oikeat arvot
    expect(createBlogHandler.mock.calls[0][0].author).toBe(newBlogObj.author)
    expect(createBlogHandler.mock.calls[0][0].title).toBe(newBlogObj.title)
    expect(createBlogHandler.mock.calls[0][0].url).toBe(newBlogObj.url)

  })

})