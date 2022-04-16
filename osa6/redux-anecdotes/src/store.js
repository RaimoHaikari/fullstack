/*
 * 6.9 anekdootit, step7
 *
 * - Asenna projektiin Redux Toolkit. Siirrä tämän jälkeen Redux-storen määrittely omaan tiedostoon store.js 
 *   ja hyödynnä sen luonnissa Redux Toolkitin configureStore-funktiota. Ota myös käyttöön Redux DevTools 
 *   sovelluksen tilan debuggaamisen helpottamiseksi.
 */
import {configureStore} from '@reduxjs/toolkit'

import anecdoteReducer from './reducers/anecdoteReducer';
import notificationReducer from './reducers/notificationReducer';
import filterReducer from './reducers/filterReducer';


const store = configureStore({
    reducer: {
        anecdotes: anecdoteReducer,
        notification: notificationReducer,
        filter: filterReducer
    }
})

export default store;

