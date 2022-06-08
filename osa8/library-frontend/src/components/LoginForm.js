import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const LoginForm = ({ show, tokenName, setPage, setToken }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [ login, result ] = useMutation(
        LOGIN,
        {
            onError: (error) => {
                console.log(error.graphQLErrors[0].message)
            }
        }
    );

    /*
     * Efektihookki on tarpeen, jotta sovellus ei joutuisi ikuiseen renderöintilooppiin....
     */
    useEffect(() => {
        
        if(result.data){
            const token = result.data.login.value;

            setToken(token);
            localStorage.setItem(tokenName, token);

            setUsername('')
            setPassword('')

            setPage('authors')
            
        }
    }, [result.data]);

    if (!show) {
        return null
    }

    const submit = async (event) => {

        event.preventDefault()
        login({variables: {username, password}})

    }


    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={submit}>

                <div>
                    username
                    <input 
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>

                <div>
                    password
                    <input 
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>

                <button type='submit'>login</button>
            
            </form>

            <p><small><strong>users: [nokinena, soppa, mluukkai]<br />password: qwerty</strong></small></p>
        </div>
    );
};

export default LoginForm;