/* eslint-disable */
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Montserrat', sans-serif;
    }

	body {
		background-color: ${({ theme }) => theme.colors.backgroundColor};
	}
`

export const Container = styled.div`
    width: 100%;
    max-width: 1300px;
    margin-right: auto;
    margin-left: auto;
    padding: 0 50px;

    @media screen and (max-width: 960px){
        padding: 0 30px
    }
`

export const MainHeading = styled.h1`
    font-size: clamp(2.3rem, 6vw, 4.5rem);
    margin-bottom: 2rem;
    color: ${({inverse, theme}) => (inverse ? theme.colors.darkShade : theme.colors.whiteShade )};
    width: 100%;
    letter-spacing: 4px;
    text-align: center;
`


export const Heading = styled.h2`
	font-size: 2em;
	letter-spacing: -2px;
	border-bottom: 2px solid black;
	text-transform: uppercase;
	margin: 1rem 0;
	color: ${({inverse, theme}) => (inverse ? theme.colors.darkShade : theme.colors.whiteShade )};
`

export const Section = styled.section`
	padding: ${({ padding }) => (padding ? padding : '10px 10px')};
	background: ${({theme}) => (theme.colors.whiteShade )};
`

export const UnicornAfter = styled.div`
  &:before {
    content: " 🦄";
  }
`

export const Button = styled.button`
    border-radius: 4px;
    background: none;
    white-space: nowrap;
    padding: 10px 20px;
    font-size: 16px;
    color: #FFE109;
    outline: none;
    border: 2px solid #fff;
    cursor: pointer;
    overflow: hidden;
    position: relative;

	&:before {
		background: #fff;
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: all 0.6s ease;
		width: 100%;
		height: 40%;
		transform: translate(-50%, -50%) rotate(45deg);
	}

	&:hover:before {
		height: 500%;
        opacity: 0.1;
	}

	&:hover {
		color: black;
	}


`


export default GlobalStyle