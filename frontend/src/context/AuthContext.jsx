
import React, { createContext, useContext, useState } from 'react'
import { loginAdmin } from '../service/AdminAuth';
import { authService } from '../service/public-site-auth';

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {

  // ==============Admin Auth ===============

  const [adminUser, setAdminUser] = useState(() => {

    const saved = localStorage.getItem('admin_user');

    return saved ? JSON.parse(saved) : null;
  });

  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token'));
  const isAdminAuthenticated = !!adminToken;

  const [user, setUser] = useState(() => {

    const saved = localStorage.getItem('public_user') || localStorage.getItem('user');

    return saved ? JSON.parse(saved) : null;
  })

  const [token, setToken] = useState(() =>
    localStorage.getItem('public_token') || localStorage.getItem('auth_token')
  );
  const isAuthenticate = !!token;

  const login = async (credential) => {

    const data = await loginAdmin(credential);

    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const loginPublic = async (credentials) => {
    const data = await authService.login(credentials);

    localStorage.setItem('public_token', data.token);
    localStorage.setItem('public_user', JSON.stringify(data.user));
    localStorage.setItem('auth_token', data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logoutPublic = () => {
    localStorage.removeItem('public_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('public_user');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };




  const loginPublicWithToken = async(oauthtoekn) => {

    localStorage.setItem('public_token', oauthtoekn);
    setToken(oauthtoekn);

      const userData = await authService.getCurrentuser(oauthtoekn);
      const resolvedUser = userData.user || userData;

      localStorage.setItem('public_user', JSON.stringify(resolvedUser));
      setUser(resolvedUser);

      return resolvedUser;
  }

//  const logoutPublic = async () => {
//     try {
//       if (token && authService.logout) {
//         await authService.logout(token);
//       }
//     } finally {
//       localStorage.removeItem('public_token');
//       localStorage.removeItem('public_user');
//       setToken(null);
//       setUser(null);
//     }
//   };


   
  return (
    

      <AuthContext.Provider value={{
        // admin===
        adminUser,
        adminToken,
        isAdminAuthenticated,
        login,


        // ========public

        user,
        token,
        isAuthenticate,
        loginPublic,
        loginPublicWithToken,
        logoutPublic,
     

        
        }} >
        {children}
      </AuthContext.Provider>


  )
}

export const useAuth =() => {

  return useContext(AuthContext);
}

export default AuthProvider