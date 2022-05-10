/* eslint-disable */
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import Bloglist from '../components/BlogList'

const BloglistPage = () => {

    const { loggedUser } = useSelector(state => {

        const _loggedUser = state.user.username !== null ? true : false

        return {
            loggedUser: _loggedUser
        }
    })


    /*
     <Navigate replace to="/" />
    */
    return (
        <>
        {
          loggedUser
            ? <Bloglist />
            : null
        }
      </>
    );
};

export default BloglistPage;