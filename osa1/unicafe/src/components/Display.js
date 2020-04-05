import React from 'react';

const Display = (props) => {
    
  return (
    <div className={props.className}>{props.text}</div>
  );
}

export default Display;