import { useState } from 'react';

import {Routes, Route, useMatch} from 'react-router-dom';

import Menu from './components/menu';
import About from './components/about';
import Footer from './components/footer';
import AnecdoteList from './components/anecdoteList';
import CreateNew from './components/createNew';
import Anecdote from './components/anecdote';
import Notification from './components/notification';



const App = () => {

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  /*
   * 7.2: routed anecdotes, step2
   * - Toteuta sovellukseen yksittäisen anekdootin tiedot näyttävä näkymä:
   */
  const match = useMatch('/anecodotes/:id');
  const selectedAnecdote = match
    ? anecdotes.find(a => a.id === Number(match.params.id))
    : null




  const [notification, setNotification] = useState(null);

  const addNew = (anecdote) => {

    console.log("in addNew");
    console.log(anecdote)

    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));

    setNotification(`a new anecdote: '${anecdote.content}' was created`);

    setTimeout(() => {
      setNotification(null)
    }, 5000);

  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {

    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))

  }

  return (
    <div>

      {
        notification !== null
        ? <Notification message={notification} />
        : null
      }



      <h1>Software anecdotes</h1>
      <Menu />

      <Routes>
        <Route path="/new" element={<CreateNew addNew={addNew} />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/anecodotes/:id" element={<Anecdote anecdote={selectedAnecdote}/>}/>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />}/>
      </Routes>

      <Footer />
    </div>
  )
}

export default App
