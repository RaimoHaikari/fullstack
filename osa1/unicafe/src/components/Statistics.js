import React from 'react';
import Display from './Display.js';

const Statistics = ({stats, className}) => {

  const noFeedBackTxt = 'No feedback given';

  /*
   * Onko palautteita annettu?
   */
  if(stats.all() === 0){
    return (
      <div className={`${className} bgRed`}>
        <Display text={noFeedBackTxt} className = "unicafeMsg" />
      </div>
    );
  }

  return (
    <table>
      <tbody>
        <tr>
          <th scope="row">Good</th>
          <td>{stats.good()}</td>
        </tr>
        <tr>
          <th scope="row">Neutral</th>
          <td>{stats.neutral()}</td>
        </tr>
        <tr>
          <th scope="row">Bad</th>
          <td>{stats.bad()}</td>
        </tr>  
        <tr>
          <th scope="row">All</th>
          <td>{stats.all()}</td>
        </tr>
        <tr>
          <th scope="row">Average</th>
          <td>{stats.average()}</td>
        </tr>
        <tr>
          <th scope="row">Positive</th>
          <td>{stats.postive()}</td>
        </tr>  
      </tbody>
    </table>
  );
}

export default Statistics;