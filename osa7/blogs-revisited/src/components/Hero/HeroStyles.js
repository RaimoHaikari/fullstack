/* eslint-disable linebreak-style */
import styled from 'styled-components'
import { Button } from '../../globalStyles'

export const HeroSection = styled.section`
	height: 100vh;
	background-position: center;
	background-size: cover;
	padding-top: clamp(70px, 25vh, 220px);
	box-shadow: inset 0 0 0 1000px rgba (0, 0, 0, 0.2);
`

export const HeroText = styled.p`
	margin-bottom: 35px;
	font-size: clamp(0.9rem, 1.5vw, 1.3rem);
	line-height: 24px;
	text-align: center;
	letter-spacing: 2px;
	color: ${({ theme }) => theme.hero.heroTextColor};
`

export const ButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-flow: wrap;
	gap: 0.5rem;
`

export const HeroButton = styled(Button)`
	color: white;

	&:before {
		background: ${({ theme }) => theme.hero.buttonBackground};
		height: 500%;
		opacity: 0.3
	}

	&:hover:before {
		height: 0%;
	}

	&:hover {
		color: white;
	}
`