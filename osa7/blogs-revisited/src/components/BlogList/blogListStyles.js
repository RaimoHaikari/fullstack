/* eslint-disable linebreak-style */
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const UL = styled.ul`
    list-style-type: none;
    padding: 10px 20px;
`

export const LI = styled.li`
    padding: 10px 20px;
    margin-bottom: 5px;
    background-color: white;
    border-left-width: 10px;
    border-left-style: solid;
    border-left-color: ${({ theme }) => ( theme.colors.whiteShade )};
`

export const StyledLink = styled(Link)`
  color: ${({ theme }) => ( theme.colors.middleShade )};;
  text-decoration: none;
  margin: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`