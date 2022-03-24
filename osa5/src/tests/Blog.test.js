/* eslint-disable linebreak-style */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('<Blog />', () => {

  const blogObject = {
    title: 'Hevosen suusta',
    author: 'Tallihuhuilija',
    url: 'www.hopitihop.com',
    likes: 7,
    user: {
      username: 'ethel',
      name: 'Ethel Barrymore',
      id: '621fd475dd6ba68c8ecb9843'
    },
    id: '6220c5859ed9230eeb530498',
  }

  const likeBtnHandler = jest.fn()
  const removeBtnHandler = jest.fn()

  // eslint-disable-next-line no-unused-vars
  let blogComponent

  beforeEach(() => {

    blogComponent = render(
      <Blog
        blog={blogObject}
        likeBtnHandler={likeBtnHandler}
        removeBtnHandler={removeBtnHandler}
      />
    )

  })

  /*
   * 5.13: blogilistan testit, step1
   * - Tee testi, joka varmistaa että blogin näyttävä komponentti renderöi blogin titlen, authorin
   *   mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää.
   *
   *   Luokka Blog.js päättää blogiobjektin expanded-kentän arvon perusteella minkälainen listaus
   *   näyttetään. Tämän kentän arvo asetetaan "vasta"VfrontEndissä, kun aineisto luetaan palvelimelta.
   *   Muokkasin koodia tätä tehtävää varten siten, että mikäli kenttää ei ole määritetty,
   *   oletusarvoksi asetetaan Blog.js sisällä, että näytetään vain otsikkotieto. Joten
   *   testatessa käytetään käsittelemätöntä blogiobjektia
   *
   *   Oletuslistauksessa minulla näytetään pelkästään blogin otsikko. Laajennetussa listauksessa
   *   otsikkoriville lisätään tieto blogin kirjoittajasta. Joten testissä kirjoittajan nimeä
   *   ei haeta....
   */
  test('Lähtökohtaisesti näytetään vain otsikko', () => {

    // - otsikko löytyy
    expect(screen.getByText(blogObject.title)).toBeDefined()

    // - url ei
    expect(screen.queryByText(blogObject.url)).toBeNull()

    // - tykkäysten määrä ei
    expect(screen.queryByText(`likes ${blogObject.likes}`)).toBeNull()
  })

  /*
   * 5.14: blogilistan testit, step2
   * - Tee testi, joka varmistaa että myös url ja likejen määrä näytetään kun blogin kaikki tiedot näyttävää nappia on painettu.
   */
  test('view-painikkeen painallus tulostaa url:in ja tykkäysten määrän', () => {

    const button = screen.getByText('view')
    userEvent.click(button)

    // - otsikko ja tykkäysten määrä löytyvät
    expect(screen.getByText(blogObject.url)).toBeDefined()
    expect(screen.getByText(`likes ${blogObject.likes}`)).toBeDefined()
  })

  /*
   * 5.15: blogilistan testit, step3
   * - Tee testi, joka varmistaa, että jos komponentin like-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa.
   */
  test('like-painikkeen painallukset välittyvät eteenpäin', () => {

    // - sisältö näkyville..
    const viewButton = screen.getByText('view')
    userEvent.click(viewButton)

    // - etsitään like-painike ja klikataan kaksi kertaa
    const likeButton = screen.getByText('like')
    userEvent.click(likeButton)
    userEvent.click(likeButton)

    // - otsikko ja tykkäysten määrä löytyvät
    expect(screen.getByText(blogObject.url)).toBeDefined()
    expect(likeBtnHandler.mock.calls).toHaveLength(2)
  })

})