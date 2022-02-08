import React from "react";

const TooManyCountries = ({countries}) => {
    
    return (
        <div>
            {`Too many matches, specify another file [${countries.length}]`}
        </div>
    )
}

export default TooManyCountries;