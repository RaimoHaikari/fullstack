import React from "react";

const Search = ({searchHandler, searchStr}) => {
    return (
        <div>
            find countries: <input
                value={searchStr}
                onChange={searchHandler}
            />
        </div>
    )
}

export default Search