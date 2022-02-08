import React from "react";
import Header from "./Header";
import Content from "./Content";

/* 
 * 2.5: erillinen moduuli
 * Määrittele komponentti Course omana moduulinaan, jonka komponentti App importtaa. Voit sisällyttää kaikki kurssin alikomponentit samaan moduuliin.
 */
const Course = ({name, parts}) => {
    /*
     * 
     */
    return (
      <div>
        <Header 
          name={name}
        />
        <Content 
          parts={parts}
        />
      </div>
    )

}
  
  
export default Course;
  