import { useDispatch } from 'react-redux';


const AnecdoteForm = () => {

    const dispatch = useDispatch();

    const addAnecdote = (event) => {

        event.preventDefault()
    
        const content = event.target.anecdote.value
        event.target.anecdote.value = '';

        dispatch({ type: 'anecdotes/createAnecdote', payload: content });

        dispatch({ type: 'notification/displayNotification', payload: `New anecdote: ${content}` });

        setTimeout(() => {
            dispatch({ type: 'notification/clearNotification', payload: null })
        }, 5000);
    
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