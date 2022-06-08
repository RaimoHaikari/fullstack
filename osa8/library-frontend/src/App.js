import { 
  useApolloClient,
  useSubscription
} from '@apollo/client';

import { useEffect, useRef, useState } from 'react';

import { 
  BOOK_ADDED,
  GENRE_FILTERED_BOOKS
 } from "./queries";

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';
import Notification from './components/Notification';



const App = () => {

  const client = useApolloClient()

  const pollIntervalRef = useRef(2000);
  const tokenNameRef = useRef('address-book-token');

  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState(null);

  /*
   * Pidetään yllä listaa siitä mitä genre-määrityksiä käyttäjä on valinnut kirjaluetteloa tutkiessaan
   */
  const [filteredGenres, setFilteredGenres] = useState(['all'])

  useEffect(() => {
    const loggedUserData = window.localStorage.getItem(tokenNameRef.current)

    
    if(loggedUserData){
      //const user = JSON.parse(loggedUserJSON)
      setToken(loggedUserData)
    }
    
  }, [])

  /*
   * Genre-filtteröidyt kirjat haetaan palvelimelta parametriperusteisella kyselyllä ja nämä kyselyt
   * talletetaan välimuistiin. 
   * 
   * Kun palvelimelta tulee tieto uudesta kirjasta (subscription), niin 
   * 
   */
  const updateFilteredGenres = (g) => {

    if(filteredGenres.indexOf(g) === -1){
      setFilteredGenres(filteredGenres.concat(g))
    } 
  }

  /*
   * pitäskö tutkia addedBook genres...
   * ja concatenoide distinctiin jos ei jo ole....
   */
  const updateCache = (addedBook, g) => {

    client.cache.updateQuery(
      { 
          query: GENRE_FILTERED_BOOKS,
          variables: {genre: g}
      },
      ({ allBooks, distinctGenres }) => {

        let x = addedBook.genres.filter(g => {
          return distinctGenres.indexOf(g) === -1
        })

        return {
          allBooks: allBooks.concat(addedBook),
          distinctGenres: distinctGenres.concat(x)
        }
      }
    )

  }


  useSubscription(
    BOOK_ADDED,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        
        const addedBook = subscriptionData.data.bookAdded;

        
        filteredGenres.forEach(g => {
          
          let ind = addedBook.genres.indexOf(g);

          if(g === 'all' || ind !== -1)
            updateCache(addedBook, g === 'all' ? null : g);

        })
        

      


        /*
        client.cache.updateQuery(
          { 
              query: GENRE_FILTERED_BOOKS,
              variables: {genre: null}
          },
          ({ allBooks, distinctGenres }) => {

            return {
              allBooks: allBooks.concat(addedBook),
              distinctGenres: distinctGenres
            }
          }
        )
        */
        
        setMessage(`${addedBook.title} lisättiin juuri äsken!`)
        setTimeout(() => {
          setMessage(null)
        }, 2000)
      }
    }
  )

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

    setPage('authors')

  }


  return (
    <div>

      <Notification message={message} />

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {
          token
          ? <button onClick={() => setPage('add')}>add book</button>
          : <button onClick={() => setPage('loginForm')}>login</button>
        }

        {
          token && <button onClick={() => setPage('recommendations')}>recommendations</button>
        }

        {
          token && <button onClick={logout}>logout</button>
        }
        
      </div>

      <Authors pollInterval = {pollIntervalRef.current} show= {page === 'authors'} loggedUser={token !== null} />

      <Books 
        pollInterval = {pollIntervalRef.current} 
        show={page === 'books'}
        filterWatch={updateFilteredGenres}
      />

      <NewBook 
        show={page === 'add'} 
      />

      <Recommendations pollInterval = {pollIntervalRef.current} show= {page === 'recommendations'} />

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
