import react from "react";

const Notification = ({message, success}) => {

    const notificationStyle = () => {
        return (
            {
                marginBottom: 20,
                backgroundColor: success ? 'green' : 'red',
                padding: 5
            }
        )
    }


    if(message === null)
        return null

    return (
        <div 
            style={notificationStyle()}
        >
            {message}
        </div>
    )
}

export default Notification