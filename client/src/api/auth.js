import api from "./client";

export const login = async (payload) => {
  const { data } = await api.post("/api/users/login", payload);
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/api/users/register", payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/api/users/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/api/users/profile", payload);
  return data;
};
