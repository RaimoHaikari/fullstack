import React from "react";

const Content = (props) => {
  return(
    <div>
      <Part 
        data = {props.parts[0]}
      />
      <Part 
        data = {props.parts[1]}
      />
      <Part 
        data = {props.parts[2]}
      />
    </div>
  )
}

const Header = (props) => {

  return (
    <h1>{props.name}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.data.name} {props.data.exercises}
    </p>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  )
}

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },{
        name: 'Using props to pass data',
        exercises: 7
      },{
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  /*

   */
  return (
    <div>
      <Header 
        name={course.name}
      />
      <Content 
        parts = {course.parts}
      />
      <Total 
        parts = {course.parts}
      />
    </div>
  )


}


export default App;
