import { useEffect, useState } from "react";

import { gql, useMutation } from "@apollo/client";

import { EDIT_AUTHOR } from "../queries";

const SetAuthorBorn = ({ author, onClose }) => {

    const [year, setYear] = useState('')


    useEffect(() => {

        if(author.born)
            setYear(author.born)

    }, [])


    const [ editAuthor ] = useMutation(EDIT_AUTHOR)


    const submit = async (event) => {

        event.preventDefault()

        const name = author.name

        editAuthor({
            variables: {
                name: name,
                setBornTo: year
            }
        })

        onClose()

    }

    const birthYearHandler = (val) => {
        const updValue = val !== '' ? parseInt(val) : '';
        setYear(updValue)
    }

    return (
        <div>
           <h2>Set the year of birth</h2>
           <form onSubmit={submit}>
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>name</td>
                            <td>
                                <input
                                    type="name"
                                    value={author.name}
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>year of birth</td>
                            <td>                
                                <input
                                    type="number"
                                    value={year}
                                    onChange={({ target }) => birthYearHandler(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit">submit</button>             
                            </td>
                        </tr>
                    </tbody>
                </table>

           </form>
           <button onClick={onClose}>close</button>
        </div>
    );
};

export default SetAuthorBorn;