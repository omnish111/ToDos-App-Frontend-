import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getMe, loginUser, registerUser } from "../services/authService";
import { clearAuthData, getStoredToken, getStoredUser, saveAuthData } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await getMe();
        setUser(response.data.user);
      } catch (error) {
        clearAuthData();
        setUser(null);
        setToken(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const handleAuthSuccess = (payload, rememberMe = true) => {
    const authData = payload.data;
    saveAuthData(authData, rememberMe);
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (payload, rememberMe = true) => {
    const response = await loginUser(payload);
    handleAuthSuccess(response, rememberMe);
    return response;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    handleAuthSuccess(response);
    return response;
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isCheckingAuth,
      login,
      register,
      logout
    }),
    [user, token, isCheckingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
