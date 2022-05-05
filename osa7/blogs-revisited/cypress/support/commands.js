// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {

  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogsAppUser', JSON.stringify(body)) // App.handleLogin()
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {



  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: {
      title,
      author,
      url,
      likes
    },
    headers :{
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogsAppUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})

/*
 * How to click x number of times in Cypress
 * -https://stackoverflow.com/questions/56865974/how-to-click-x-number-of-times-in-cypress
 */
Cypress.Commands.add('doMultilpeLikes', (toggleButton, nOfClicks, delay = 500) => {

  cy
    .get(toggleButton)
    .click()

  cy
    .get('button[id^="like_btn_"]')
    .as('likeButton')

  Cypress._.times(nOfClicks, function () {

    cy.get('@likeButton')
      // The submit button is disabled on the first click, so
      // force is set to TRUE to prevent the test from failing
      // due to clicking a disabled element.
      .click({ force: true })

    cy.wait(delay)

  })

  cy
    .get(toggleButton)
    .click()
})



