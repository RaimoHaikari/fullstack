/* eslint-disable linebreak-style */
import styled from 'styled-components'
import { Button } from '../../globalStyles'

export const TogglableButton = styled(Button)`
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