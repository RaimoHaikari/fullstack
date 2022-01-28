import React, {useState} from "react";

/*
 * Button vastaa yksittäistä palautteenantonappia
 * - 1.10: unicafe step5
 */
const Button = ({clickHandler, text}) => {
  return (
    <button
      onClick={clickHandler}
    >
      {text}
    </button>
  )
}

const Title = ({text}) => {

  return (
    <h1>{text}</h1>
  )

}

/*
 * Tilastojen näyttäminen
 *
 * - 1.8: unicafe step3
 * - 1.9: unicafe step4
 */
const Statistics = ({stats, titleText}) => {

  if(stats.total() === 0) {
    return (
      <div>
        <Title 
          text={titleText}
        />      
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
        <Title 
          text={titleText}
        />
        <table>
          <tbody>
            <StatisticLine 
              text="good"
              value={stats.good()}
            />
            <StatisticLine 
              text="neutral"
              value={stats.neutral()}
            />
            <StatisticLine 
              text="bad"
              value={stats.bad()}
            />
            <StatisticLine 
              text="all"
              value={stats.total()}
            />
            <StatisticLine 
              text="average"
              value={stats.average()}
            />
            <StatisticLine
              text="positive"
              value={stats.percentageOfPositive()}
            />
          </tbody>
        </table>
    </div>
  )

}

/*
 * StatisticLine huolehtii tilastorivien, esim. keskiarvon näyttämisestä
 * - 1.10: unicafe step5
 * - 1.11*: unicafe step6
 */
const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const badHandler = () => {
    setBad(bad + 1)
  }

  const goodHandler = () => {
    setGood(good + 1)
  }

  const neutralHandler = () => {
    setNeutral(neutral + 1)
  }



  const statsObj = {
    average: function(){
      let tot = this.total()

      if(tot === 0)
        return 0
  
      return Math.abs(good - bad) / tot
    },
    bad: function(){
      return bad
    },
    good: function(){
      return good
    },
    neutral: function(){
      return neutral
    },
    percentageOfPositive: function(){

      let tot = this.total()

      if(tot === 0)
        return `0 %`
  
      return `${(good /tot) * 100} %`
    },
    total: function(){
      return good + neutral + bad
    }
  }


  return(
    <div>
      <Title 
        text="Give feedback"
      />
      <Button 
        text="good"
        clickHandler={goodHandler}
      />
      <Button 
        text="neural"
        clickHandler={neutralHandler}
      />
      <Button 
        text="bad"
        clickHandler={badHandler}
      />
      <Statistics 
        titleText = "Statistics"
        stats = {statsObj}
      />
    </div>
  )

}

export default App;
