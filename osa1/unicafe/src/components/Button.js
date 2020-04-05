import React from 'react';

const Button = (props) => {

    const {text,handler,css} = props.data

    return (
      <button 
          className = {css} 
          type="button" 
          onClick={handler}>
          {text}
      </button>
    );
}


export default Button;