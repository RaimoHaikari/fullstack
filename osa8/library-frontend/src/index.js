import React from 'react';
import ReactDOM from 'react-dom';

import { setContext } from 'apollo-link-context';

import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    split
} from '@apollo/client';

/* Tilaukset clientissä */
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws'

import App from './App';

const authLink = setContext((_, { headers }) => {
    const _token  = localStorage.getItem('address-book-token');

    return {
        headers: {
            ...headers,
            authorization: _token ? `bearer ${_token}` : null
        }
    }
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

/* 
 * subscriptions
 * - sovelluksella tulee nyt olla HTTP-yhteyden lisäksi websocket-yhteys GraphQL-palvelimelle
 */
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
        reconnect: true
    }
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    authLink.concat((httpLink))
);

/*
 * client-olion muodostamisen yhteydessä oleva toinen parametri link määrittelee, 
 * miten apollo on yhteydessä palvelimeen. Nyt normaalia httpLink-yhteyttä muokataan siten, 
 * että pyyntöjen mukaan asetetaan headerille authorization arvoksi localStoragessa 
 * mahdollisesti oleva token.
 * 
 * - huom. link päivitetty subscription rekisteröinnin yhteydessä
 */
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
});

/*
const a = ['crime','revolution','agile'];
const filtered = ['all', 'revolution']

console.log(a)
console.log(filtered)

filtered.forEach(f => {

    let ind = a.indexOf(f)

    if(f === 'all' || ind !== -1){
        console.log(f, " pitää näyttää")
    }
})
*/



ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
)
