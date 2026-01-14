import api from "./client";

export const getPolicy = async (key) => {
  const { data } = await api.get(`/api/policies/${key}`);
  return data;
};
