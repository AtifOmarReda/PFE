import { createContext, useState, useEffect, useMemo } from "react";
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    let loginUser = async (formValues) => {
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        })
        let data = await response.json()
        if (!response.ok) {
            alert("Nom d'utilisateur ou mot de passe incorrect. si vous êtes sûr du nom d'utilisateur et du mot de passe, contactez un administrateur");
            return false
        } else{
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            return true
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        if(localStorage.getItem('favoriteItems')) localStorage.removeItem('favoriteItems')
    }

    let updateToken = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': authTokens.refresh})
        })
        let data = await response.json()

        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else logoutUser()

        if(loading) setLoading(false)
    }
    
    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    useEffect(() => {

        if(loading && authTokens) updateToken()

        let fourMinutes = 1000*60*4
        let interval = setInterval(() => {
            if(authTokens) updateToken()
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authTokens, loading]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}