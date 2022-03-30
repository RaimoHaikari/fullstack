/* eslint-disable linebreak-style */
import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import LoginForm from './components/LoginForm'
import UserData from './components/UserData'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  /*
   * - ref menkanismin avulla saadaan yhteys toisen komponentin sisällä
   *   olevaan funktioon
   */
  const togglableRef = useRef()
  const blogFormRef = useRef()

  /*
   * Notification komponentissa näytettävä viesti:
   * {
   *  success: true/false,
   *  message: 'Tulostettava viesti'
   * }
   */
  const [messageObject, setMessageObject] = useState(null)

  const LOCAL_STORAGE_ITEM_NAME = 'loggedBlogsAppUser'
  const MESSAGE_VISIBLE_TIME = 2000

  /*
   * 5.9: blogilistan frontend, step9
   * - Järjestä sovellus näyttämään blogit likejen mukaisessa suuruusjärjestyksessä.
   */
  useEffect(() => {
    blogService.getAll().then(blogs => {

      blogs = blogs
        .map(blog => {
          return {
            ...blog,
            expanded: false
          }
        })
        .sort((a,b) => {

          if(a.likes > b.likes)
            return -1

          if(a.likes < b.likes)
            return 1

          return 0

        })

      setBlogs(blogs)
    })
  }, [])

  /*
   * Tsekataan onko kirjautumistiedot talletettu localStorageen
   */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser')

    if(loggedUserJSON){

      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

    }
  }, [])


  const clearUserData = () => {
    setUsername('')
    setPassword('')
  }

  /*
   * 5.4: blogilistan frontend, step4
   * - Toteuta sovellukseen notifikaatiot, jotka kertovat sovelluksen yläosassa
   *   onnistuneista ja epäonnistuneista toimenpiteistä
   */
  const displayMessage = (success, message) => {

    setMessageObject({ success,message })

    setTimeout(() => {
      setMessageObject(null)
    }, MESSAGE_VISIBLE_TIME)

  }

  /*
   * 5.10: blogilistan frontend, step10
   * - Näytä poistonappi ainoastaan jos kyseessä on kirjautuneen käyttäjän lisäämä blogi.
   */
  const getBlogs = () => {

    return blogs
      .map(blog => {

        let owner= blog.user.username
        let currentUser = user.username

        const viewRemoveBtn = owner === currentUser
          ? true
          : false

        blog = {
          ...blog,
          ownerOfBlog: viewRemoveBtn
        }

        return (

          <Blog
            key={blog.id}
            blog={blog}
            likeBtnHandler={handleLike}
            removeBtnHandler={handleRemove}
          />

        )
      })

  }


  /*
   * Lomakkeiden onSubmit - tapahtumakäsittelijät
   */
  const handleLogin = async (event) => {

    event.preventDefault()

    try {
      const user = await loginService
        .login({ username, password })

      window.localStorage.setItem(
        'loggedBlogsAppUser',
        JSON.stringify(user)
      )

      setUser(user)
      blogService.setToken(user.token)

      displayMessage(true, `Tervetuloa ${user.name}`)
      clearUserData()

    } catch (exception) {

      displayMessage(false, 'Kirjautuminen epäonnistui.')
      clearUserData()

      //setMessageObject({ success: false, message: 'Kirjautuminen epäonnistui.' })

    }
  }

  /*
   * 5.2: blogilistan frontend, step2
   * - Tee kirjautumisesta "pysyvä" local storagen avulla. Tee sovellukseen myös mahdollisuus uloskirjautumiseen:
   */
  const handleLogout = () => {

    displayMessage(true, 'Käyttäjä kirjautui ulos')

    window.localStorage.removeItem(LOCAL_STORAGE_ITEM_NAME)
    setUser(null)
    //clearBlogData();

  }

  /*
   * 5.3: blogilistan frontend, step3
   * - Laajenna sovellusta siten, että kirjautunut käyttäjä voi luoda uusia blogeja:
   */
  const handleAddNew = async (newBlog) => {

    try {

      /*
       * Napataan talteen serverin palauttama tallennettu tietue ja käytetään sitä
       * listauksen päivityksessä....
       */
      const addedBlog = await blogService.create(newBlog)

      setBlogs(blogs.concat(addedBlog))

      displayMessage(true, `A new blog: ${addedBlog.title} by ${addedBlog.author} added`)

      /* - suljetaan ja tyhjennetään blogitietojen syöttölomake */
      togglableRef.current.toggleVisibility()
      blogFormRef.current.clearBlogData()

      //clearBlogData();

    } catch (exception) {

      console.log('Uuden blogin lisäys ei onnistunut')
      console.log(exception)

      displayMessage(false, 'Adding failed. Check that your data is correct')

    }

  }

  /*
   * 5.15: blogilistan testit, step3
   *
   * - Tee testi, joka varmistaa, että jos komponentin like-nappia painetaan kahdesti,
   *   KOMPONENTIN PROPSINA SAAMAA TAPAHTUMANKÄSITTELIJÄFUNKTIOTA KUTSUTAAN KAKSI KERTAA.
   */
  const handleLike = async updatedBlog => {

    try {

      await blogService.update(updatedBlog)

      const updatedBlogs = blogs.map(blog => {
        if(blog.id === updatedBlog.id)
          return updatedBlog

        return blog
      })

      displayMessage(true, 'Tykkään, tykkään, tykkään....')
      setBlogs(updatedBlogs)

    } catch (exception) {

      console.log('Tykkäys ei onnistunut')
      console.log(exception)

      displayMessage(false, `${exception.response.data.error}`)

    }

  }

  const handleRemove = async blog => {


    try {

      const msg = `Remove blog ${blog.title} by ${blog.author}`
      const val = window.confirm(msg)

      const blogToBeRemove = blog.id

      if(val !== true)
        return

      await blogService.deleteBlog(blogToBeRemove)

      displayMessage(true, `${blog.title} poistettiin`)
      setBlogs(blogs.filter(blog => blog.id !== blogToBeRemove))

    } catch (exception) {

      console.log('Poisto ei onnistunut')
      console.log(exception)

      displayMessage(false, `${exception.response.data.error}`)

    }

  }

  return (
    <div>
      {
        messageObject === null
          ?
          null
          :
          <Notification
            message={messageObject.message}
            success={messageObject.success}
          />
      }
      {
        user === null
          ?
          <LoginForm
            password = {password}
            passwordChangeHandler = {(val) =>  setPassword(val)}
            username = {username}
            usernameChangeHandler = {(val) => setUsername(val)}
            submitHanler = {handleLogin}
          />
          :
          <div>

            <UserData
              name={user.name}
              logoutHandler={handleLogout}
            />

            <h2>blogs</h2>

            <Togglable buttonLabel="Add new.." ref={togglableRef}>

              <NewBlog
                createBlog = {handleAddNew}
                ref = {blogFormRef}
              />

            </Togglable>

            {
              getBlogs()
            }
          </div>
      }
    </div>
  )
}

export default App
