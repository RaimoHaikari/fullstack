import { useSelector, useDispatch } from 'react-redux';
import {voteAnecdote} from '../reducers/anecdoteReducer';

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

const Anecdotes = () => {
    
    const dispatch = useDispatch();

    const anecdotes = useSelector(state => {

        const sortedState = state.sort(anecdoteListSorter);

        return sortedState;
    });

    return (
        <div>
            {anecdotes.map(anecdote => 
                <Anecdote 
                    key={anecdote.id}
                    clickHandler = {() => dispatch(voteAnecdote(anecdote.id))}
                    content={anecdote.content}
                    votes={anecdote.votes}
                />
            )}
        </div>
    );
};

export default Anecdotes;