/* eslint-disable  */
import styled from 'styled-components'
import { Button } from '../../globalStyles'

import { Link } from 'react-router-dom'

export const UnicornSystemsLinkBar = styled.div`
    
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 40px;
    background: ${({ theme }) => theme.colors.whiteMiddleShade};
`

export const StyledLink = styled(Link)`
  color: ${({ theme }) => ( theme.colors.middleShade )};;
  text-decoration: none;
  margin: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`

export const UnicornButton = styled(Button)`
	color:  ${({ theme }) => theme.colors.darkShade};
    background-color: ${({ theme }) => theme.colors.whiteShade};

	&:before {
		height: 0%;
	}

	&:hover:before {
		height: 0%;
	}

	&:hover {
		color: white;
	}
`