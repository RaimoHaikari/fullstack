import React, { useState } from 'react'

const Button = ({clickHandler, text}) => {
  return(
    <div>
      <button onClick={clickHandler}>
        {text}
      </button>
    </div>
  )
}

const Message = ({text}) => {
  return(
    <div>{text}</div>
  )
}

const Title = ({text}) =>{
  return (
    <h3>{text}</h3>
  )
}

const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [maxVoteCount, setMaxVoteCount] = useState(0)
  const [indexOfMostPopular, setIndexOfMostPopular] = useState(0)

  const getVoteCountMessage = () => {

    if(votes[selected] === 0)
      return "dosn't yet have any votes"

    return `has ${votes[selected]} votes`
  }


  const showNextHandler = () => {
    const index = randomIntFromInterval(0, anecdotes.length - 1)
    setSelected(index)
  }

  const voteHandler = () => {
    const copy = [...votes]
    copy[selected] = copy[selected] + 1

    if(copy[selected] > maxVoteCount){
      setMaxVoteCount(copy[selected])
      setIndexOfMostPopular(selected)
    }

    setVotes(copy)
  }


  /*
   * Generate random number between two numbers in JavaScript
   * https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
   */
  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return (
    <div>
      <Title 
        text="Anecdote of the day"
      />
      <Message 
        text={anecdotes[selected]}
      />
      <Message 
        text={getVoteCountMessage()}
      />
      <Button 
        text="Vote"
        clickHandler={voteHandler}
      />
      <Button 
        text="Next anecdote"
        clickHandler={showNextHandler}
      />
      <Title 
        text="Anecdote with most votes"
      />
      <Message 
        text={anecdotes[indexOfMostPopular]}
      />
      <Message 
        text={`has ${maxVoteCount} votes`}
      />
    </div>
  )
}

export default App