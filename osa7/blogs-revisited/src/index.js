/* eslint-disable linebreak-style */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
  BrowserRouter as Router
} from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store'

import { ThemeProvider } from 'styled-components'
import GlobalStyle from './globalStyles'

import theme from './theme'


ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <App />
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
)