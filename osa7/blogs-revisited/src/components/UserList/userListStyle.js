/* eslint-disable  */
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Table = styled.table`
    border-collapse: collapse;
    background-color: white;

    tr:nth-child(even) {background-color: #f2f2f2;}
`

export const StyledLink = styled(Link)`
  color: ${({ theme }) => ( theme.colors.middleShade )};;
  text-decoration: none;
  margin: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`