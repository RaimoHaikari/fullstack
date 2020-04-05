import React from 'react';

const Message = ({className, text}) => {

  return (
    <div className={className}>
        {text}
    </div>
  );
}

export default Message;