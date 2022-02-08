import React  from 'react'

/*
 * 2.10: puhelinluettelo step5
 * Jos koko sovelluksesi on tehty yhteen komponenttiin, refaktoroi sitä eriyttämällä sopivia komponentteja.
 */
const AddNewContactForm = ({fields, submitBtnText , submitHandler}) => {

    return (
        <form onSubmit={submitHandler}>
            {
                fields.map(field => {
                    return (
                        <div key={field.id}>
                            {field.text} <input 
                                value={field.value}
                                onChange={field.handler}
                            />
                        </div>
                    )
                })
            }
            <div>
                <button type="submit">{submitBtnText}</button>
            </div>
        </form>
    )
}

export default AddNewContactForm