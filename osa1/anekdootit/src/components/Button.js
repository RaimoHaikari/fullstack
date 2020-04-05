import React from 'react';

const Button = ({data}) => {

  const {className, handleClick} = data

  return (
    <button 
      className={className} 
      onClick={handleClick}>
        {data.text}
    </button>
  );
}

export default Button;
