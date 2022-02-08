import React from 'react'

/*
 * 2.10: puhelinluettelo step5
 * Jos koko sovelluksesi on tehty yhteen komponenttiin, refaktoroi sitä eriyttämällä sopivia komponentteja. 
 * 
 * {`${person.name}: ${person.number.length === 0? '-': person.number}`}
 */ 
const SingleContact = ({deleteHandler, id, name, number}) => {

    const deleteButtonStyle = () => {
        return (
            {
                marginLeft: 20
            }
        )
    }

    const singleContactDivStyle = () => {
        return (
            {
                marginBottom: 10
            }
        )
    }

    /*
     *
     */
    return (
        <div style={singleContactDivStyle()}>
            {`${name}: ${number.length === 0? '-': number}`}
            <button
                onClick={() => deleteHandler(id)}
                style={deleteButtonStyle()}
            >
                Delete
            </button>
        </div>
    )
}

export default SingleContact