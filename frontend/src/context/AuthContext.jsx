
import React, { createContext, useState } from 'react'

const authContext = createContext(null);

const AuthContext = ({children}) => {

    const [user, setUser] = useState(() =>{

        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {

        return localStorage.getItem('token');
    })

    const isAuthenticated = !!token;

  return (
    <div>

    </div>
  )
}

export default AuthContext