/* eslint-disable jest/expect-expect */
/* eslint-disable linebreak-style */
const NAME = 'Oiva Turakainen'
const USERNAME = 'tilli'
const PW = 'accad'

const TITLE_OF_BLOG = 'Sanasta miestä, sarvista härkää'
const AUTHOR_OF_BLOG = 'Olavi Lättmjölk'
const URL_OF_BLOG = 'http://www.pgup.com'

describe('Blog app', function(){

  /*
   * Testin beforeEach-alustuslohkon tulee nollata tietokannan tilanne
   * esim. materiaalissa näytetyllä tavalla.
   */
  beforeEach(function() {

    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      username: USERNAME,
      name: NAME,
      password: PW
    }
    cy
      .request('POST', 'http://localhost:3003/api/users/', user)
      .then(resp => {
        console.log("Käyttäjä lisätty")
      })

    cy.visit('http://localhost:3000')
  })

  /*
   * 5.17: blogilistan end to end -testit, step1
   * - Konfiguroi Cypress projektiisi. Tee testi, joka varmistaa, että sovellus
   *   näyttää oletusarvoisesti kirjautumislomakkeen.
   */
  it('login form is shown', function() {

    cy.get('#blogAppLoginForm')
    cy.get('#blogAppLoginFormUsernameField')
    cy.get('#blogAppLoginFormPasswordField')

  })

  /*
   * 5.18: blogilistan end to end -testit, step2
   * Tee testit kirjautumiselle, testaa sekä onnistunut että epäonnistunut kirjautuminen. Luo testejä varten käyttäjä beforeEach-lohkossa.
   */
  describe('Login', function() {

    it('succeeds with correct credentials', function(){

      cy
        .get('#blogAppLoginFormUsernameField')
        .type(USERNAME)

      cy
        .get('#blogAppLoginFormPasswordField')
        .type(PW)

      cy
        .get('#blogAppLoginFormSubmitButton')
        .click()

      cy.contains(`Tervetuloa ${NAME}`)

    })

    it('fails with wrong credentials', function() {

      cy
        .get('#blogAppLoginFormUsernameField')
        .type(USERNAME)

      cy
        .get('#blogAppLoginFormPasswordField')
        .type('sanasala')

      cy
        .get('#blogAppLoginFormSubmitButton')
        .click()

      cy
        .get('#blogAppNoticationDiv')
        .should('contain','Kirjautuminen epäonnistui.')  // ~ App.js:handleLogin()
        .and('have.css', 'background-color', 'rgb(255, 0, 0)')

    })

  })

  describe('when logged in', function() {

    beforeEach(function(){
      cy.login({ username: USERNAME, password: PW })

      cy.createBlog({
        title: 'Voi hitsin hitsi',
        author: 'Hanna Harwahammas',
        url: 'www.kyopelinvuori.com'
      })
    })

    /*
     * 5.19: blogilistan end to end -testit, step3
     * - Tee testi, joka varmistaa, että kirjaantunut käyttäjä pystyy luomaan blogin. T
     */
    it('A blog can be created', function() {

      cy
        .contains('Add new..')  // App.return(...)
        .click()

      cy
        .get('#blogAppNewBlogTitle')
        .type(TITLE_OF_BLOG)

      cy
        .get('#blogAppNewBlogAuthor')
        .type(AUTHOR_OF_BLOG)

      cy
        .get('#blogAppNewBlogUrl')
        .type(URL_OF_BLOG)

      cy
        .get('#blogAppNewBlogCreate')
        .click()

      // Onnistumisesta kertova viesti
      cy
        .get('#blogAppNoticationDiv')
        .should('contain',`A new blog: ${TITLE_OF_BLOG} by ${AUTHOR_OF_BLOG} added`)  // ~ App.js:handleLogin()
        .and('have.css', 'background-color', 'rgb(0, 128, 0)')

      // Löytyypi listalta
      cy
        .get('.blogAppBlogTitle')
        .should('contain',`${TITLE_OF_BLOG}`)
    })

    it.only('blog can be liked', function(){

      cy.contains('view').click()
      cy.contains('like').click()

    })

  })
})