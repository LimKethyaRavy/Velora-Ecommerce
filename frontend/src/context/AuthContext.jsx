
import React, { createContext, useContext, useState } from 'react'
import { loginAdmin } from '../service/AdminAuth';

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(() =>{

        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {

        return localStorage.getItem('token');
    })

    const isAuthenticated = !!token;

    const login = async (credentials) => {
      const data = await loginAdmin(credentials);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return data
    }

  return (
    

      <AuthContext.Provider value={{user, token, isAuthenticated, login}} >
        {children}
      </AuthContext.Provider>


  )
}

export const useAuth =() => {

  return useContext(AuthContext);
}

export default AuthProvider