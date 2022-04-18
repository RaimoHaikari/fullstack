import { useDispatch } from 'react-redux';

import {saveAnecdote} from '../reducers/anecdoteReducer';

import {setNotification} from '../reducers/notificationReducer'


const AnecdoteForm = () => {

    const dispatch = useDispatch();

    const addAnecdote = async (event) => {

        event.preventDefault()
    
        const content = event.target.anecdote.value
        event.target.anecdote.value = '';

        // Uuden lisäys
        dispatch(saveAnecdote(content))

        // Tiedoitusasiat
        dispatch(setNotification(`New anecdote: ${content}`, 2));
    
    }

    return (
        <div>
            <form onSubmit={addAnecdote}>
                <div><input name="anecdote" /></div>
                <button>create</button>
            </form>
        </div>
    );

};

export default AnecdoteForm;