import Anecdotes from './components/Anecdotes';
import ConnectedAnecdoteForm from './components/ConnectedAnecdoteForm';
import ConnectedNotification from './components/ConnectedNotification'
import ConnectedFilter from './components/ConnectedFilter';

const App = () => {

  /*
   *
   */
  return (
    <div>
      <ConnectedNotification />
      <h2>Anecdotes</h2>
      <ConnectedFilter />
      <Anecdotes />
      <h2>Create New</h2>
      <ConnectedAnecdoteForm />
    </div>
  )
}

export default App