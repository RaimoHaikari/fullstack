import { useState } from "react";
import { useQuery } from "@apollo/client";

import { ALL_AUTHORS } from "../queries";

import SetAuthorBorn from "./SetAuthorBorn";

const Authors = (props) => {

  const result = useQuery(
    ALL_AUTHORS, {
      pollInterval: 2000
    }
  )

  const [authorBornInEdit, setAuthorBornInEdit] = useState(null)

  if (!props.show) {
    return null
  }

  if(result.loading) {
    return <div>Loading...</div>
  }

  const authors = result.data.allAuthors

  /*
   *
   */
  if(authorBornInEdit){

    const selectedAuthor = authors.filter(a => a.name === authorBornInEdit)[0]

    return(
      <SetAuthorBorn 
        author={selectedAuthor}
        onClose={() => setAuthorBornInEdit(null)}
      />
    )
     
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
            <th></th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
              <td>
                <button
                  onClick={() => setAuthorBornInEdit(a.name)}
                >
                   set year of birth
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
