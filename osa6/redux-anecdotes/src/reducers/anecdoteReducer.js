import { createSlice } from "@reduxjs/toolkit"

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

const initialState = anecdotesAtStart.map(asObject)

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
      state.push({
        content,
        votes: 0,
        id: getId()
      })
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

/*

    createAnecdote(state, action) {
      const content = action.payload,
      state.push({
        content,
        important: false,
        id: generateId()
      })
    }
*/

export const {createAnecdote, voteAnecdote} = anecdoteSlice.actions;
export default anecdoteSlice.reducer;