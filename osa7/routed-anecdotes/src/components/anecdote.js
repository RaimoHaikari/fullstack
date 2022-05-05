/*
 * 7.2: routed anecdotes, step2
 * - Toteuta sovellukseen yksittäisen anekdootin tiedot näyttävä näkymä
 */
const Anecdote = ({anecdote}) => {

    return (
        <div>
            {anecdote.content}
            <ul>
                <li>by: {anecdote.author}</li>
                <li>has: {anecdote.votes} votes</li>
                <li>wan't to know more? Check the <a href={anecdote.info} rel="noreferrer" target="_blank">{anecdote.info}</a></li>
            </ul>
        </div>
    );
};

export default Anecdote;