/* eslint-disable linebreak-style */
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const addComment = async (id, comment) => {

  const response = await axios.post(`${baseUrl}/${id}/comments`, { 'content': comment })
  return response.data
}

/*
 * 5.3: blogilistan frontend, step3
 * - Laajenna sovellusta siten, että kirjautunut käyttäjä voi luoda uusia blogeja:
 */
const create = async newBlog => {

  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data

}

const deleteBlog = async id => {

  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data

}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


const setToken = newToken => {
  token = `bearer ${newToken}`
}

/*
 * 5.8: blogilistan frontend, step8
 *
 * - Toteuta like-painikkeen toiminnallisuus.
 */
const update = async modifiedBlog => {

  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${modifiedBlog.id}`, modifiedBlog, config)

  return response.data

}

export default {
  addComment,
  create,
  deleteBlog,
  getAll,
  setToken,
  update
}