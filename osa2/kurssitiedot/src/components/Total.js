import React from "react";

/*
 * 2.2: kurssitiedot step7
 * - Ilmoita myös kurssin yhteenlaskettu tehtävien lukumäärä.
 * 2.3*: kurssitiedot step8
 * - Jos et jo niin tehnyt, laske koodissasi tehtävien määrä taulukon metodilla reduce.
 */
const Total = ({parts}) => {

    /*
     * How to find the sum of an array of numbers
     * https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
     */
    const getTheNumberOfExercises = () => {
        return parts.map(part => part.exercises).reduce((a, b) => a + b, 0)
    }

    return (
        <p>
            {`Number of exercises ${getTheNumberOfExercises()}`}
        </p>
    )
}
  
  
export default Total;
  