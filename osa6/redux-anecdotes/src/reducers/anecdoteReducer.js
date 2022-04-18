import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from '../services/anecdotes';

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

// const initialState = anecdotesAtStart.map(asObject)
const initialState = []

/*
 * A C T I O N   C R E A T O R S
 */

/*
 * 6.4: anekdootit, step2
 * - Tee sovellukseen mahdollisuus uusien anekdoottien lisäämiselle.
 * 
 * 6.6: anekdootit, step4

export const createAnecdote = content => {
  return {
    type: 'NEW_ANECDOTE',
    data: asObject(content)
  }
}
*/

/*
 * 6.3: anekdootit, step1
 * - Toteuta mahdollisuus anekdoottien äänestämiseen. Äänien määrä tulee tallettaa Redux-storeen.
 * 
 * 6.6: anekdootit, step4

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE_ANECDOTE',
    data: { id }
  }
}
*/

/*
 * R E D U C E R

const reducer = (state = initialState, action) => {

  switch(action.type) {

    case 'NEW_ANECDOTE':

      return state.concat(action.data);

    case 'VOTE_ANECDOTE':

      const id = action.data.id;
      const anecdoteToChange = state.find(a => a.id === id);

      const changedAndecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }

      return state.map(anecdote => 
        anecdote.id === id ? changedAndecdote : anecdote
      )
    
    default:
      return state;
  }

}
*/

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action){
      const content = action.payload;
      state.push(content)
    },
    setAnecdotes(state, action){
      return action.payload
    },
    updateAnecdote(state, action){

      const id = action.payload.id;
      const updatedAnecdote = action.payload.updatedAnecdote;

      return state.map(anecdote => 
        anecdote.id === id ? updatedAnecdote : anecdote
      )
    },
    voteAnecdote(state, action){

      const id = action.payload;
      const anecdoteToChange = state.find(a => a.id === id);

      const changedAndecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }

      return state.map(anecdote => 
        anecdote.id === id ? changedAndecdote : anecdote
      )
    }
  }
});


export const {createAnecdote, setAnecdotes, updateAnecdote} = anecdoteSlice.actions;

/*
 * 6.15 anekdootit ja backend, step3
 * - Muuta Redux-storen alustus tapahtumaan Redux Thunk -kirjaston avulla toteutettuun asynkroniseen actioniin.
 */
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
}

/*
 * 6.16 anekdootit ja backend, step4
 * - Muuta myös uuden anekdootin luominen tapahtumaan Redux Thunk -kirjaston avulla toteutettuihin asynkronisiin actioneih
 */
export const saveAnecdote = newAnecdote => {

  return async dispatch => {
    const addedAnecdote = await anecdoteService.createNew(newAnecdote);
    dispatch(createAnecdote({
      ...addedAnecdote
    }))
  }

}

/*
 * 6.17 anekdootit ja backend, step5
 * -Äänestäminen ei vielä talleta muutoksia backendiin. Korjaa tilanne Redux Thunk -kirjastoa hyödyntäen.
 */
export const update = (updatedAnecdote) => {

  return async dispatch => {

    const id = updatedAnecdote.id;

    const savedAnecdote = await anecdoteService.update(id, updatedAnecdote);

    dispatch(updateAnecdote({
      id,
      updatedAnecdote: {...savedAnecdote}
    }))

  }

}


export default anecdoteSlice.reducer;