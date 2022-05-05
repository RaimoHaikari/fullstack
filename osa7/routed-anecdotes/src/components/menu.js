import React from 'react';
import {Link} from 'react-router-dom';


const Menu = () => {

    const divStyle = {
        marginBottom: 10,
        paddingBottom: 5,
        borderBottom: '1px dotted gray'
    }

    const padding = {
        paddingRight: 5
    }

    return (
        <div style={divStyle}>
            <Link style={padding} to="/">anecdotes</Link>
            <Link style={padding} to="/new">create new</Link>
            <Link style={padding} to="/about">about</Link>
        </div>
    );
};

export default Menu;