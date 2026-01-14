import api from "./client";

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/api/products", { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/api/products/${id}`);
  return data;
};

export const getProductFilters = async () => {
  const { data } = await api.get("/api/products/filters");
  return data;
};

export const getBrands = async () => {
  const { data } = await api.get("/api/products/brands");
  return data;
};
