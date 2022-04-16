import Anecdotes from './components/Anecdotes';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import Filter from './components/Filter';

const App = () => {

  /*
   *
   */
  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter />
      <Anecdotes />
      <h2>Create New</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App