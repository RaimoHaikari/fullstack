import React from 'react';

const Languages = ({country}) => {

    const lqKeys = Object.keys(country.languages)

    return (
        <div>
            <h4>Languages</h4>
            <ul>
            {lqKeys.map(lqKey => {
                return (
                <li
                    key={lqKey}
                >
                {country.languages[lqKey]}
                </li>
                )
            })}
            </ul>        
        </div>
    )

}

export default Languages