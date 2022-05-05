import { useEffect } from 'react';
import {useField, useResource} from './hooks';

const App = () => {

  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  useEffect(() => {
    content.clear();
  }, [notes])

  useEffect(() => {
    name.clear();
    number.clear();
  }, [persons])

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value });
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  /* 
   * How to omit specific properties from an object in JavaScript
   * https://stackoverflow.com/questions/43011742/how-to-omit-specific-properties-from-an-object-in-javascript/43011802
   */
 const inputFilter = ({type,value,onChange}) => ({type,value,onChange});

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...inputFilter({...content})} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...inputFilter({...name})} /> <br/>
        number <input {...inputFilter({...number})} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App