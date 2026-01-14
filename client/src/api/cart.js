import api from "./client";

export const getCart = async () => {
  const { data } = await api.get("/api/cart");
  return data;
};

export const addToCart = async (payload) => {
  const { data } = await api.post("/api/cart/items", payload);
  return data;
};

export const updateCartItem = async (productId, payload) => {
  const { data } = await api.put(`/api/cart/items/${productId}`, payload);
  return data;
};

export const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/api/cart/items/${productId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/api/cart");
  return data;
};
