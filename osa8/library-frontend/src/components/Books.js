import { useState } from "react";
import { useQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  
  const [selectedGenre, setSelectedGenre] = useState('all')

  const result = useQuery(
    ALL_BOOKS, {
      pollInterval: props.pollInterval
    }
  )

  if (!props.show) {
    return null
  }

  if(result.loading) {
    return <div>Loading...</div>
  }

  const books = result.data.allBooks
  const genres = result.data.distinctGenres

  const getFilteredBookList = () => {

    return books.filter(book => {

      const gList = book.genres;

      if(selectedGenre === 'all')
        return true;

      return book.genres.indexOf(selectedGenre) !== -1;
    })

  }

  const genreSelection = () => {

    const displayedGenreList = ['all'].concat(genres)

    return (
      <div>
        Select genre:
        <select onChange={(e) => setSelectedGenre(e.target.value)}>
          {
            displayedGenreList.map((genre, index) => {
              return (
                <option 
                  value={genre}
                  key={`${index}_${genre}`}
                >
                  {genre}
                </option>
              )
            })
          }
        </select>
      </div>
    )
  }

  getFilteredBookList()
  
  return (
    <div>
      <h2>books</h2>

      {
        genreSelection()
      }

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {getFilteredBookList().map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              <td>{a.genres.join(' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
