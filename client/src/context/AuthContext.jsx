import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getProfile, login as loginApi, register as registerApi } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
    const profile = {
      _id: data?._id,
      email: data?.email,
      firstName: data?.firstName,
      lastName: data?.lastName,
      isAdmin: data?.isAdmin,
      streetAddr: data?.streetAddr,
      city: data?.city,
      state: data?.state,
      postalCode: data?.postalCode,
      country: data?.country,
    };
    setUser(profile);
  }, []);

  const login = async (payload) => {
    const data = await loginApi(payload);
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getProfile();
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
