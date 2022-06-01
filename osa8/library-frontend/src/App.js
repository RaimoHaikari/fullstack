import { useEffect, useRef, useState } from 'react';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import { useApolloClient } from '@apollo/client';

const App = () => {

  const client = useApolloClient()

  const pollIntervalRef = useRef(200000);
  const tokenNameRef = useRef('address-book-token');

  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loggedUserData = window.localStorage.getItem(tokenNameRef.current)

    
    if(loggedUserData){
      //const user = JSON.parse(loggedUserJSON)
      setToken(loggedUserData)
    }
    
  }, [])

  /*
   * Lisätään sovellukselle myös nappi, jonka avulla kirjautunut käyttäjä voi kirjautua ulos. 
   * Napin klikkauskäsittelijässä asetetaan token tilaan null, poistetaan token local storagesta 
   * ja resetoidaan Apollo clientin välimuisti. 
   * 
   * Tämä on tärkeää, sillä joissain kyselyissä välimuistiin on saatettu hakea dataa, 
   * johon vain kirjaantuneella käyttäjällä on oikeus päästä käsiksi.
   */
  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();

  }


  return (
    <div>

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {
          token
          ? <button onClick={() => setPage('add')}>add book</button>
          : <button onClick={() => setPage('loginForm')}>login</button>
        }

        {
          token && <button onClick={logout}>logout</button>
        }
        
      </div>

      <Authors pollInterval = {pollIntervalRef.current} show= {page === 'authors'} loggedUser={token !== null} />

      <Books pollInterval = {pollIntervalRef.current} show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <LoginForm 
        tokenName={tokenNameRef.current}
        setToken={setToken} 
        show={page === 'loginForm'} 
        setPage={setPage}
      />

    </div>
  )
}

export default App
