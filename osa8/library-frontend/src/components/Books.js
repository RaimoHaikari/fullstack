import { useState } from "react";
import { useQuery } from "@apollo/client";

import { GENRE_FILTERED_BOOKS } from "../queries";

// props
const Books = ({ filterWatch, show }) => {

  const [selectedGenre, setSelectedGenre] = useState('all');
  
  const {data, loading, error} = useQuery(
    GENRE_FILTERED_BOOKS,
    {variables: {genre: selectedGenre === 'all' ? null : selectedGenre}}
  )


  if (!show) {
    return null
  }

  if(loading) {
    return <div>Loading...</div>
  }

  const books = data.allBooks
  const genres = data.distinctGenres

  const updateGenreSelection = (val) => {

    filterWatch(val)
    setSelectedGenre(val)

  }



  const genreSelection = () => {

    const displayedGenreList = ['all'].concat(genres)

    return (
      <div>
        Select genre:
        <select 
          onChange={(e) => updateGenreSelection(e.target.value)}
          defaultValue = { selectedGenre }
        >
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
          {books.map((a) => (
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
