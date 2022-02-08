import React from 'react'
import SingleContact from './SingleContact'

/*
 * 2.10: puhelinluettelo step5
 * Jos koko sovelluksesi on tehty yhteen komponenttiin, refaktoroi sitä eriyttämällä sopivia komponentteja. 
 */ 
const ContactList = ({contacts, deleteHandler}) => {

    const contactListStyle = () => {
        return (
            {
                borderTop: "1px gray dotted",
                borderBottom: "1px gray dotted",
                paddingTop: 10
            }
        )
    }

    /*
     *
     */
    return (
        <div style={contactListStyle()}>
            {contacts.map((contact) => {
                return (
                    <SingleContact 
                        key = {contact.id}
                        id= {contact.id}
                        name= {contact.name}
                        number={contact.number}
                        deleteHandler={deleteHandler}
                    />
                )
            })}
        </div>
    )
}

export default ContactList