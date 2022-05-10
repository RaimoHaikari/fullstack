/* eslint-disable linebreak-style */
import styled from 'styled-components'

export const UL = styled.ul`
    list-style-type: none;
    padding: 10px 0px;
`

export const LI = styled.li`
    padding: 10px 20px;
    margin-bottom: 5px;
    background-color: white;
    border-left-width: 10px;
    border-left-style: solid;
    border-left-color: ${({ theme }) => ( theme.colors.whiteShade )};
`