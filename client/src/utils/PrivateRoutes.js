import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    return(
        localStorage.getItem('authTokens') ? <Outlet /> : <Navigate to="/" />
    )
}

export default PrivateRoutes