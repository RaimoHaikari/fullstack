import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {initializeAnecdotes, update} from '../reducers/anecdoteReducer';
import {setNotification} from '../reducers/notificationReducer';


/*
 * 6.5: anekdootit, step3
 * - Huolehdi siitä, että anekdootit pysyvät äänten mukaisessa suuruusjärjestyksessä.
 */
const anecdoteListSorter = (a, b) => {

  
    if(a.votes > b.votes)
      return -1

    if(a.votes < b.votes)
      return 1

    return 0
}

const Anecdote = ({content, clickHandler,  id, votes}) => {
    return (
        <div key={id}>
            <div>
                {content}
            </div>
            <div>
                has {votes}
                <button onClick={clickHandler}>vote</button>
            </div>
        </div>        
    )
}

/*
 * TypeError: Cannot assign to read only property '0' of object '[object Array]' in typescript
 * - https://stackoverflow.com/questions/64957735/typeerror-cannot-assign-to-read-only-property-0-of-object-object-array-in
 */
const Anecdotes = () => {
    
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(initializeAnecdotes())

    }, [dispatch])

    const anecdotes = useSelector(state => {

        const filterSrt = state.filter.filterStr;

        let items = [...state.anecdotes]

        if(filterSrt !== null)
            items = items.filter(item => item.content.includes(filterSrt))
        


        return items.sort(anecdoteListSorter);
    });

    /*
     * dispatch({ type: 'anecdotes/voteAnecdote', payload: anecdote.id })
     */
    const voteHandler = async (anecdote) => {

        dispatch(update({...anecdote,votes: anecdote.votes + 1}))

        // Tiedoitusasiat
        dispatch(setNotification(`You voted: ${anecdote.content}`, 2));

    }

    /*
     * clickHandler = {() => dispatch({ type: 'anecdotes/voteAnecdote', payload: anecdote.id })}
     */
    return (
        <div>
            {anecdotes.map(anecdote => 
                <Anecdote 
                    key={anecdote.id}
                    clickHandler = {() => voteHandler(anecdote)}
                    content={anecdote.content}
                    votes={anecdote.votes}
                />
            )}
        </div>
    );
};

export default Anecdotes;