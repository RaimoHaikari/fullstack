import React from 'react';
import ReactDOM from 'react-dom';

import { setContext } from 'apollo-link-context';

import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache
} from '@apollo/client';

import App from './App';

const authLink = setContext((_, { headers }) => {
    const token  = localStorage.getItem('address-book-token');
    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null
        }
    }
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

/*
 * client-olion muodostamisen yhteydessä oleva toinen parametri link määrittelee, 
 * miten apollo on yhteydessä palvelimeen. Nyt normaalia httpLink-yhteyttä muokataan siten, 
 * että pyyntöjen mukaan asetetaan headerille authorization arvoksi localStoragessa 
 * mahdollisesti oleva token.
 */
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
)
