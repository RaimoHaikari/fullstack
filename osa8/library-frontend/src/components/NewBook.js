import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, GENRE_FILTERED_BOOKS } from '../queries';

const NewBook = ({ show }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  /*
   * 8.22 Välimuistin ajantasaisuus
   *
   * - Jos haet tietyn genren kirjat GraphQL:llä eli teit edellisen tehtävän, 
   *   varmista jollain tavalla se, että kirjojen näkymä säilyy ajantasaisena. 
   *   Eli kun lisäät uuden kirjan, päivittyy se kirjalistalle viimeistään siinä 
   *   vaiheessa kun painat jotain genrevalintanappia. Ilman uuden genrevalinnan 
   *   tekemistä, ei näkymän ole pakko päivittyä.
   */
  const getRefetchQueries = () => {

    let x = genres.map(g => {
      return ({
        query: GENRE_FILTERED_BOOKS,
        variables: {genre: g}
      })
    })

    x.push(
      {
        query: GENRE_FILTERED_BOOKS,
        variables: {genre: null}
      }
    )

    x.push({ query: ALL_BOOKS })
    x.push({ query: ALL_AUTHORS})

    return x
  }

  /*
   *
   */
  const [ addBook ] = useMutation(
    ADD_BOOK,
    {
      refetchQueries: getRefetchQueries()
    }
  )

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({
      variables: {
        title,
        author,
        published,
        genres
      }
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <form onSubmit={submit}>

        <table>
          <tbody>
            <tr>
              <td>title</td>
              <td>
                <input
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>author</td>
              <td>
                <input
                  value={author}
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>published</td>
              <td>
                <input
                  type="number"
                  value={published}
                  onChange={({ target }) => setPublished(parseInt(target.value))}
                />
              </td>
            </tr>
          </tbody>
        </table>


        <div style={{ marginTop: "10px" }}>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>

        <div  style={{ marginTop: "10px" }}>genres: {genres.join(' ')}</div>

        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
