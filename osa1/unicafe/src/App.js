import React, { useState } from 'react';
import './App.css';
import Display from './components/Display.js';
import Button from './components/Button';
import Statistics from './components/Statistics';

const App = () => {

  const headerTxt = "Give Feedback"
  const labelTxt = "Statistics"

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const btnGood = {
    text: "Good",
    css: "unicafeBtn bgGeen",
    handler: () => setGood(good + 1)
  }

  const btnNeutral = {
    text: "Neutral",
    css: "unicafeBtn bgBlue",
    handler: () => setNeutral(neutral + 1)
  }

  const btnBad = {
    text: "Bad",
    css: "unicafeBtn bgRed",
    handler: () => setBad(bad + 1)
  }

  const precentageFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  const numOfFeedbacks = () => {
    return  good + neutral + bad
  }

  const stats = {
    good: () => good,

    neutral: () => neutral,

    bad: () => bad,

    all: () => {
      return numOfFeedbacks();
    },
    average: () => {

      const nOF = numOfFeedbacks()

      if(nOF === 0){
        return 0;
      }

      return ((good * 1) + (bad * -1)) / nOF;
    },
    postive: () => {

      const nOF = numOfFeedbacks()

      const value = nOF===0?0:(good / nOF);
      
      return new Intl.NumberFormat('fi-FI', precentageFormatOptions).format(value)
    }
  }

  return (
    <div>
      <Display text={headerTxt} className = "unicafeTitle" />
      <Button data={btnGood}/>
      <Button data={btnNeutral}/>
      <Button data={btnBad}/>
      <Display text={labelTxt} className = "unicafeLabel" />
      <Statistics className = "unicafeStatsDiv" stats={stats}/>

    </div>
  );
}

export default App;
