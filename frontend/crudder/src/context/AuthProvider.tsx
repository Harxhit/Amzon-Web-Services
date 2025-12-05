import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import api from "../api/axios";
import {io} from 'socket.io-client'

const  socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ["websocket"]
});
const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAuth, setUserAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async() =>  {
      try {
        const response = await api.get("/auth/me"); 
        setIsLoggedIn(true);  
        setUserAuth(response.data?.user);
      } catch (err) {
        setIsLoggedIn(false);
        setUserAuth(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (user: any) => {
    setUserAuth(user);
    setIsLoggedIn(true);
    setLoading(false)
  };

  const logout = async () => {
    try {
      await api.post("/user/sign-out");
    } catch (err) {}

    setIsLoggedIn(false);
    setUserAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userAuth,
        loading,
        setLoading,
        login,
        logout,
        setUserAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export {AuthProvider , socket}
