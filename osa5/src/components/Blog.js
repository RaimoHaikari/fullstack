/* eslint-disable linebreak-style */
import { useState } from 'react'

import propTypes from 'prop-types'

//import blogService from '../services/blogs'

import TextAndButton from './TextAndButton'

const Blog = ({ blog, likeBtnHandler, removeBtnHandler }) => {

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
          <span>{`likes ${blog.likes}`}</span>
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
  const likeButtonHandlerBAK = async () => {

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
  */

  /*
   * displayMessage(false, 'Kirjautuminen epäonnistui.');
   */
  const likeButtonHandler = async () => {

    const newLikeCount = blog.likes + 1

    const updatedBlog = {
      ...blog,
      likes: newLikeCount
    }

    likeBtnHandler(updatedBlog)

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