/* eslint-disable */
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import blogsReducer from '../reducers/blogsReducer';

const SelectedUser = () => {

    const id = useParams().id


    const { user, loggedUser } = useSelector(state => {

        const filteredUser = state.userlist.filter(user => user.id === id)
        const _loggedUser = state.user.username !== null ? true : false

        let userObj = null

        
        if(filteredUser.length === 1){

            userObj = {
                ...filteredUser[0],
            }

        }
    
        return {
          user: userObj,
          loggedUser: _loggedUser
        }
    })

    const displayDataSheet = () => {

        return (
            <div>
                <h3>{user.name}</h3>
                {
                    user.blogs.length > 0
                    ? <p>added blogs:</p>
                    : <p>hasn't added any blogs yet</p>
                }
                
                <ul>
                    {
                        user.blogs.map(blog => {
                            return (
                                <li key={blog.id}>
                                    <Link to={`/blogs/${blog.id}`}>
                                        {blog.title}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

    return (
        <React.Fragment>
        {
            loggedUser
            ? user !== null
                ? displayDataSheet()
                : <Navigate replace to="/users" />
            : <Navigate replace to="/" />
        }
        </React.Fragment>
    );
};

export default SelectedUser;