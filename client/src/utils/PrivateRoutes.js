import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoutes = () => {
    let auth = useContext(AuthContext)
    return(
        auth.user ? <Outlet /> : <Navigate to="/" />
    )
}

export default PrivateRoutes