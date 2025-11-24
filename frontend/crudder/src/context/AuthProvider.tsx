import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import api from "../api/axios";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAuth, setUserAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async() =>  {
      try {
        const response = await api.get("/auth/me"); 
        setIsLoggedIn(true);
        setUserAuth(response.data.data.user);
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
    setIsLoggedIn(true);
    setUserAuth(user);
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
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider