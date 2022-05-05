/* eslint-disable linebreak-style */
import { useState } from 'react'
import { useSelector } from 'react-redux'

import propTypes from 'prop-types'
import TextAndButton from './TextAndButton'

//import blogService from '../services/blogs'

//import { setNotification } from '../reducers/notificationReducer'
//import { updateBlog } from '../reducers/blogsReducer'

const Blog = ({ id, likeBtnHandler, removeBtnHandler }) => {

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


  const blog = useSelector(state => {

    const filteredBlog = state.blogs.filter(blog => blog.id === id)

    if(filteredBlog.length !== 1)
      return undefined

    const owner= filteredBlog[0].user.username
    const currentUser = state.user.username

    const viewRemoveBtn = owner === currentUser
      ? true
      : false

    return {
      ...filteredBlog[0],
      ownerOfBlog: viewRemoveBtn
    }
  })

  /*
   * React make useState initial value conditional
   * - https://stackoverflow.com/questions/68945060/react-make-usestate-initial-value-conditional
   *
   * 5.13: blogilistan testit, step1
   * - Tee testi, joka varmistaa että blogin näyttävä komponentti renderöi blogin titlen, authorin mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää.
   *   OLETUSARVOISESTI MINULLA AINEISTON LUKEMISEN YHTEYDESSÄ LISÄTÄÄN JOKAISELLE BLOGIOBJEKTILLE KENTTÄ EXPANDED JA SILLE ANNETAAN ARVO FALSE,
   *   MUTTA VÄSÄTÄÄN TESTIÄ VARTEN VAIHTOEHTO, JOSSA TÄTÄ KENTTÄÄ EI OLE ASETETTU...
   */
  const expensiveFunction = () => {

    return typeof blog === 'undefined'
      ? false
      : typeof blog.expanded === 'undefined'
        ? false
        : blog.expanded

  }


  const [isExpanded, setExpanded] = useState(() => expensiveFunction())

  //const [likeCount, setLikeCount] = useState(blog.likes)

  /*
   * <span style={titleSpanStyle}>{`${blog.title} [${blog.author}]`}</span>
   */
  const longSheet = () => {
    return (
      <div className="blogAppBlogData" style={dStyle}>

        <TextAndButton
          btlLabel = {isExpanded ? 'hide' : 'view'}
          btnHandler = {() => setExpanded(!isExpanded)}
        >
          <span style={titleSpanStyle} className="blogAppBlogTitle">{`${blog.title} [by: ${blog.author}]`}</span>
        </TextAndButton>

        <p style={pStyle}>{blog.url}</p>

        <TextAndButton
          btlLabel = "like"
          btnHandler = {() => likeBtnHandler(blog)}
          id={`like_btn_${blog.id}`}
        >
          <span className='blogAppBlogLikeCount'>{`likes ${blog.likes}`}</span>
        </TextAndButton>

        <p style={pStyle}>{`was added by: ${blog.user.name}`}</p>

        {
          blog.ownerOfBlog
            ?
            <TextAndButton
              btlLabel = "remove"
              btnHandler = {() => removeBtnHandler(blog)}
              id={`remove_btn_${blog.id}`}
            />
            : null
        }

      </div>
    )
  }

  const shortSheet = () => {
    return (
      <div className="blogAppBlogData" style={dStyle}>
        <TextAndButton
          btlLabel = {isExpanded ? 'hide' : 'view'}
          btnHandler = {() => setExpanded(!isExpanded)}
        >
          <span className="blogAppBlogTitle" style={titleSpanStyle}>{`${blog.title}`}</span>
        </TextAndButton>
      </div>
    )
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
  likeBtnHandler: propTypes.func.isRequired,
  removeBtnHandler: propTypes.func.isRequired
}

export default Blog