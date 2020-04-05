import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
  return (
    <h1>{props.data.name}</h1>
  )
}

const Part = (props) => {

  return (
    <p>{props.osa.name} {props.osa.excercises}</p>
  )

}

const Content = (props) => {

  return (
    <>
      <Part osa={props.data.parts[0]} />
      <Part osa={props.data.parts[1]} />
      <Part osa={props.data.parts[2]} />
    </>
  )
}

const Total = (props) => {
  return (
    <p>
      Number of excercises {
        props.data.parts[0].excercises +
        props.data.parts[1].excercises +
        props.data.parts[2].excercises
      }
    </p>   
  )
}

const App = () => {

  const course = {

    name: 'Half Stack application development',

    parts: [
      {
        name: 'Fundamentals of React',
        excercises: 10    
      }, 
      {
        name: 'Using props to pass data',
        excercises: 7    
      }, 
      {
        name: 'State of a component',
        excercises: 14   
      }
    ]

  }


  return(
      <div>
        <Header data={course}/>
        <Content data={course} /> 
        <Total data={course} />
      </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);