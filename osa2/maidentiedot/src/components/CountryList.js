import React from "react";

const CountryList = ({countries, selectHandler}) => {
    return (
        <ul>
            {
            countries.map((c,index) => {

                return (
                <li key={`${index}-${c.flag}`}>
                    {`${c.name.common}: [${c.flag}]`}
                    <button
                        onClick={() => selectHandler(`${c.flag}`)}
                    >
                    Show
                    </button>
                </li>
                )
            })
            }
      </ul>
    )
}

export default CountryList