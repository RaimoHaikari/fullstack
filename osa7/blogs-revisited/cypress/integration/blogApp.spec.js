/* eslint-disable linebreak-style */
/* eslint-disable jest/expect-expect */
const USERS = [
  {
    name: 'Oiva Turakainen',
    username: 'tilli',
    pw: 'accad'
  },
  {
    name: 'Vieno Rastas',
    username: 'purjo',
    pw: 'dadad'
  },
]

const NEW_BLOGS = [
  {
    title: 'Voi hitsin hitsi',
    author: 'Hanna Harwahammas',
    url: 'www.kyopelinvuori.com',
    likes: 0
  },
  {
    title: 'Voi hyvanen aika tuota meidan Marttia',
    author: 'Vilma Väkäleuka',
    url: 'www.kuusimetsa.com',
    likes: 0
  },
  {
    title: 'Onko tämä testien suosituin blogi?',
    author: 'Edward von Boxis',
    url: 'www.kuusimetsa.com',
    likes: 1
  }
]

const SORT_ORDER_BLOGS = [
  {
    title: 'Alussa kolmas, lopussa eka',
    author: 'Hanna Harwahammas',
    url: 'www.kyopelinvuori.com',
    likes: 0
  },
  {
    title: 'Alussa eka, lopussa kolmas',
    author: 'Vilma Väkäleuka',
    url: 'www.kuusimetsa.com',
    likes: 2
  },
  {
    title: 'Alussa toka, lopussa toka',
    author: 'Edward von Boxis',
    url: 'www.kuusimetsa.com',
    likes: 1
  }
]


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

    const user1 = {
      username: USERS[0].username,
      name: USERS[0].name,
      password: USERS[0].pw
    }

    const user2 = {
      username: USERS[1].username,
      name: USERS[1].name,
      password: USERS[1].pw
    }

    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)


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
        .type(USERS[0].username)

      cy
        .get('#blogAppLoginFormPasswordField')
        .type(USERS[0].pw)

      cy
        .get('#blogAppLoginFormSubmitButton')
        .click()

      cy.contains(`Tervetuloa ${USERS[0].name}`)

    })

    it('fails with wrong credentials', function() {

      cy
        .get('#blogAppLoginFormUsernameField')
        .type(USERS[0].username)

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
      cy.login({ username: USERS[0].username, password: USERS[0].pw })

      cy.createBlog(NEW_BLOGS[0])
      cy.createBlog(NEW_BLOGS[1])

    })

    /*
     * 5.19: blogilistan end to end -testit, step3
     * - Tee testi, joka varmistaa, että kirjaantunut käyttäjä pystyy luomaan blogin.
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

    /*
     * 5.20: blogilistan end to end -testit, step4

     * - Tee testi, joka varmistaa, että blogia voi likettää.
     *
     * - jos haemme ... tekstin perusteella, palauttaa komento cy.contains aina ... ensimmäisen,
     *   (Näin tapahtuu siis vaikka nappi ei olisikaan näkyvillä.)
     */
    it('blog can be liked', function(){

      cy.contains('view').click()             // Avaa kahdesta alustettasessa lisätystä tietueesta ekan...
      cy.get('button[id^="like_btn_"]').click()    // ... jälkimmäistä ei edes ole domissa tällä hetkellä

      cy
        .get('.blogAppBlogLikeCount')
        .should('contain','likes 1')          // Avaustilassa: likes 0
    })

    /*
     * 5.21: blogilistan end to end -testit, step5
     *
     * - Tee testi, joka varmistaa, että blogin lisännyt käyttäjä voi poistaa blogin.
     */
    it('owner can delete blog', function(){

      cy
        .contains(NEW_BLOGS[1].title)
        .siblings('button')
        .click()

      cy
        .contains('remove')
        .click()

      cy
        .get('html')
        .should('not.contain', NEW_BLOGS[1].title)
    })

    /*
     * 5.21: blogilistan end to end -testit, step5
     *
     * - Vapaaehtoinen bonustehtävä: varmista myös että poisto ei onnistu muilta kuin blogin lisänneeltä käyttäjältä.
     */
    // eslint-disable-next-line quotes
    it(`while other users can't see the Remove -button`, function() {

      // Vaihdetaan käyttäjää
      cy.contains('Logout').click()

      cy
        .get('#blogAppLoginFormUsernameField')
        .type(USERS[1].username)

      cy
        .get('#blogAppLoginFormPasswordField')
        .type(USERS[1].pw)

      cy
        .get('#blogAppLoginFormSubmitButton')
        .click()

      // Nyt poiston ei saa onnistua...
      cy
        .contains(NEW_BLOGS[1].title)
        .siblings('button')
        .click()

      cy
        .get('button[id^="remove_btn_"]')
        .should('not.exist')

    })




  })

  /*
   * 5.22: blogilistan end to end -testit, step6
   * - Tee testi, joka varmistaa, että blogit järjestetään likejen
   *   mukaiseen järjestykseen, eniten likejä saanut blogi ensin.
   */
  describe('Blogs are ordered by their like count', function(){

    beforeEach(function(){
      cy.login({ username: USERS[0].username, password: USERS[0].pw })

      cy.createBlog(SORT_ORDER_BLOGS[0])
      cy.createBlog(SORT_ORDER_BLOGS[1])
      cy.createBlog(SORT_ORDER_BLOGS[2])

    })

    it('Order before like updates', function(){

      cy
        .get('.blogAppBlogTitle')
        .eq(0)
        .should('contain',SORT_ORDER_BLOGS[1].title)

      cy
        .get('.blogAppBlogTitle')
        .eq(1)
        .should('contain',SORT_ORDER_BLOGS[2].title)

      cy
        .get('.blogAppBlogTitle')
        .eq(2)
        .should('contain',SORT_ORDER_BLOGS[0].title)

    })


    it('Order after user interaction', function(){

      /*
       * Napataan liketettävät blogit muistiin
       */
      cy
        .get('.blogAppBlogTitle')
        .eq(2)
        .parent()
        .find('button')
        .as('firstToggleButton')

      cy
        .get('.blogAppBlogTitle')
        .eq(1)
        .parent()
        .find('button')
        .as('secondToggleButton')

      // Klikkaillaan like -painiketta
      cy.doMultilpeLikes('@firstToggleButton', 4)
      cy.doMultilpeLikes('@secondToggleButton', 2)

      // Katsotaan järjestys
      cy
        .get('.blogAppBlogTitle')
        .eq(0)
        .should('contain',SORT_ORDER_BLOGS[0].title)

      cy
        .get('.blogAppBlogTitle')
        .eq(1)
        .should('contain',SORT_ORDER_BLOGS[2].title)

      cy
        .get('.blogAppBlogTitle')
        .eq(2)
        .should('contain',SORT_ORDER_BLOGS[1].title)


    })
  })
})