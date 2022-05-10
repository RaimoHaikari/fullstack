/* eslint-disable */
import { Navigate } from 'react-router-dom'
import {  useSelector } from 'react-redux'

import SelectedUser from '../components/SelectedUser';

const SelectedUserPage = () => {

    const { loggedUser } = useSelector(state => {

        const _loggedUser = state.user.username !== null ? true : false
    
    
        return {
          loggedUser: _loggedUser
        }
      })

    // <Navigate replace to="/" />
    return (
        <>
        {
          loggedUser
            ? <SelectedUser />
            : null
        }
      </>
    );
};

export default SelectedUserPage;