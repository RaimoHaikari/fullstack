import React from 'react';

const Notification = ({message}) => {

    const divStyle = {
        backgroundColor: 'green',
        color: 'white',
        marginBottom: 10,
        padding: 10
    }   

    return (
        <div style={divStyle}>
            {message}
        </div>
    );
};

export default Notification;