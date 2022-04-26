import { connect } from 'react-redux';

import {saveAnecdote} from '../reducers/anecdoteReducer';

import {setNotification} from '../reducers/notificationReducer'

/*
 * 6.20 anekdootit ja connect, step2
 * - Tee sama Filter ja AnecdoteForm komponenteille.
 */
const AnecdoteForm = (props) => {


    const addAnecdote = async (event) => {

        event.preventDefault()
    
        const content = event.target.anecdote.value
        event.target.anecdote.value = '';

        // Uuden lisäys
        props.saveAnecdote(content);


        // Tiedoitusasiat
        props.setNotification(`New anecdote: ${content}`, 2);
    
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

const mapDispatchToProps = {
    saveAnecdote,
    setNotification
}

const ConnectedAnecdoteForm = connect(
    null,
    mapDispatchToProps
)(AnecdoteForm)

export default ConnectedAnecdoteForm;