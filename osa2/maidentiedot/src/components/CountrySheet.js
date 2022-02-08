import React from "react";
import Languages from "./Languages";

const CountrySheet = ({country}) => {

    return (
        <div>
            <h3>{country.name.common}</h3>
            <p>{`capital: ${country.capital}`}</p>
            <p>{`population: ${country.population}`}</p>
            <Languages 
            country={country}
            />
            <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} style={{border: "1px solid gray", maxWidth: '250px'}}/>
        </div>        
    )
}

export default CountrySheet