import React from 'react'

/*
 * 2.10: puhelinluettelo step5
 * Jos koko sovelluksesi on tehty yhteen komponenttiin, refaktoroi sitä eriyttämällä sopivia komponentteja. 
 */ 
const FilterForm = ({changeHandler, text, value}) => {

    const filterFormStyle = () => {
        return (
            {
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "1px gray dotted"
            }
        )
    }


    /*
     *
     */
    return (
        <form style={filterFormStyle()}>
            {`${text}:`} <input
                onChange={changeHandler}
                value={value}
            />
        </form>
    )
}

export default FilterForm