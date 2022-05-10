/* eslint-disable linebreak-style */
import styled from 'styled-components'

export const Div = styled.div`
    height: 100vh;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: white;

    div.row {
        border: 1px solid navy;
        border-radius: 5px;
        padding: 10px;
        max-width: 300px;
    }

    input[type=text], input[type=password] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    input[type=submit] {
        width: 100%;
        background-color: #4CAF50;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
    input[type=submit]:hover {
        background-color: #45a049;
    }


`

export const ButtonAsLink = styled.button`
    background: none!important;
    border: none;
    padding: 0!important;
    /*optional*/
    font-family: arial, sans-serif;
    color: #069;
    text-decoration: underline;
    cursor: pointer;
`
