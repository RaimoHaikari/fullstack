import React from 'react';

const Notification = ({message}) => {

    const notificationStyle = {
        backgroundColor: "navy",
        padding: "5px",
        color: "white",
        fontSize: "large",
        marginBottom: "10px"
    };

    if(message === null) return null;

    return (
        <div style={notificationStyle}>
            { message }
        </div>
    );
};

export default Notification;