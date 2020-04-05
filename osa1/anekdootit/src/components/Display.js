import React from 'react';
import Message from './Message'

const Display = ({data, styling}) => {

    const {anecdote, votes} = data;

  //const {className, handleClick} = data
  //{anecdotes[selected].anecdote}
  console.log(data)

  return (
    <div className={styling.div}>
      <Message className={styling.msg1} text={anecdote}/>
      <Message className={styling.msg2} text={`Votes ${votes}`}/>
    </div>
  );
}

export default Display;
