/* eslint-disable */
import React from 'react'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  ButtonWrapper,
  HeroSection,
  HeroText,
  HeroButton
} from './HeroStyles'

import {
  Container,
  MainHeading,
} from '../../globalStyles'

const Hero = () => {

  const randomInt = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
  }


  const { blogId } = useSelector(state => {

    let blogId = null

    if(state.blogs.length > 0) {
      const rndInt = randomInt(0, state.blogs.length - 1)
      blogId = state.blogs[rndInt].id
    }

    return {
      blogId
    }
  })

  return (
    <HeroSection>
      <Container>

        <MainHeading>Ajatuksien Tonava</MainHeading>

        <HeroText>
          Paras sekoitus blogien klassikoita ja tyylikkäimpiä uutuuksia.!
        </HeroText>

        {
          blogId !== null
          ? <ButtonWrapper>
              <Link to={`/blogs/${blogId}`}>
                <HeroButton>Kokeile onneasi</HeroButton>
              </Link>
            </ButtonWrapper>
          : null
        }

      </Container>
    </HeroSection>
  )
}

export default Hero