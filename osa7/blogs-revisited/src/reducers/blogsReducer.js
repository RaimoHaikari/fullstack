/* eslint-disable linebreak-style */
import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const blogListSorter = (a, b) => {

  if(a.likes > b.likes)
    return -1

  if(a.likes < b.likes)
    return 1

  return 0
}

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    addBlogToStore(state, action){

      const content = action.payload
      state.push(content)

    },
    clearBlogs(){
      return initialState
    },
    removeBlogFromStore(state, action) {

      const blogToBeRemoved = action.payload
      return state.filter(blog => blog.id !== blogToBeRemoved.id)

    },
    setBlogs(state, action){

      const blogsRaw = action.payload
        .map(blog => {
          return {
            ...blog,
            expanded: false
          }
        })
        .sort(blogListSorter)

      return blogsRaw

    },
    updateInStoreBlog(state, action) {

      const updatedBlog = action.payload

      const newState = state.map(blog => {

        if(blog.id === updatedBlog.id)
          return updatedBlog

        return blog
      })
        .sort(blogListSorter)

      return newState

    }
  }
})

export const {
  attachCommentToBlog,
  setBlogs,
  addBlogToStore,
  clearBlogs,
  removeBlogFromStore,
  updateInStoreBlog
} = blogsSlice.actions

export const addComment = (id, comment) => {

  return async dispatch => {
    const updatedBlog =  await blogService.addComment(id, comment)
    dispatch(updateInStoreBlog(updatedBlog))
  }
}


/*
 * Uuden blogin lisäys:
 * - ensin tietokantaan, jonka jälkeen lisätään vielä sovelluksen tietolaariin:)
 */
export const createNewBlog = (newBlog) => {

  return async dispatch => {

    const addedBlog = await blogService.create(newBlog)
    dispatch(addBlogToStore({ ...addedBlog }))

  }

}

/*
 * Haetaan blogit kannasta ja laitetaan tietolaariin näkösälle.
 */
export const fetchBlogs = () => {

  return async dispatch => {

    const allTheBlogs = await blogService.getAll()
    dispatch(setBlogs(allTheBlogs))

  }
}

/*
 * Blogin poisto
 * - ensin kannasta, sitten tietolaarista:)
 */
export const deleteBlog = (blogToBeRemoved) => {

  return async dispatch => {

    await blogService.deleteBlog(blogToBeRemoved.id)
    dispatch(removeBlogFromStore(blogToBeRemoved))

  }
}

/*
 * Blogin tietojen päivitys
 * - ensin kantaan ja sitten laarin päivitys
 */
export const updateBlog = updatedBlog => {

  return async dispatch => {

    await blogService.update(updatedBlog)
    dispatch(updateInStoreBlog(updatedBlog))

  }
}


export default blogsSlice.reducer