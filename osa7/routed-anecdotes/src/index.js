import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App'

import {BrowserRouter as Router} from 'react-router-dom'

/*
 * 7.2: routed anecdotes, step2
 * - valittu anekdootti välitetään tiedot esittävälle komponentille useMatch -hookin avulla
 * - useMatch-hookin käyttö ei ole mahdollista samassa komponentissa, joka määrittelee sovelluksen reititettävän osan
 *   joten Router siirretty "kerrosta alemmas"
 */
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Router>
        <App />
    </Router>
);