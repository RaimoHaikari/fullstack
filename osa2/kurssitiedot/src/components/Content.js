import React from "react";
import Part from "./Part";
import Total from "./Total";

/*
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
*/
const Content = ({parts}) => {

    return (
        <div>
            {
                parts.map(part => {
                    return (
                        <Part 
                            key={part.id}
                            name = {part.name}
                            exercises={part.exercises}
                        />
                    )
                })
            }
            <Total 
                parts={parts}
            />
        </div>
    )
}
  
  
export default Content;
  