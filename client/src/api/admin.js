import api from "./client";

export const getAllOrders = async () => {
  const { data } = await api.get("/api/orders");
  return data;
};

export const markOrderPaid = async (id) => {
  const { data } = await api.put(`/api/orders/${id}/pay`);
  return data;
};

export const markOrderShipped = async (id) => {
  const { data } = await api.put(`/api/orders/${id}/ship`);
  return data;
};

export const markOrderDelivered = async (id) => {
  const { data } = await api.put(`/api/orders/${id}/deliver`);
  return data;
};

export const cancelOrder = async (id) => {
  const { data } = await api.put(`/api/orders/${id}/cancel`);
  return data;
};

export const refundOrder = async (id, payload) => {
  const { data } = await api.put(`/api/orders/${id}/refund`, payload);
  return data;
};

export const createProduct = async (formData) => {
  const { data } = await api.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateProduct = async (productId, payload) => {
  const { data } = await api.put(`/api/products/${productId}`, payload);
  return data;
};

export const deleteProduct = async (productId) => {
  const { data } = await api.delete(`/api/products/${productId}`);
  return data;
};

export const adjustStock = async (productId, payload) => {
  const { data } = await api.patch(`/api/products/${productId}/stock`, payload);
  return data;
};

export const getCoupons = async () => {
  const { data } = await api.get("/api/coupons");
  return data;
};

export const createCoupon = async (payload) => {
  const { data } = await api.post("/api/coupons", payload);
  return data;
};

export const updateCoupon = async (id, payload) => {
  const { data } = await api.put(`/api/coupons/${id}`, payload);
  return data;
};

export const deleteCoupon = async (id) => {
  const { data } = await api.delete(`/api/coupons/${id}`);
  return data;
};

export const getGiftCards = async () => {
  const { data } = await api.get("/api/giftcards");
  return data;
};

export const createGiftCard = async (payload) => {
  const { data } = await api.post("/api/giftcards", payload);
  return data;
};

export const redeemGiftCard = async (code, payload) => {
  const { data } = await api.post(`/api/giftcards/${code}/redeem`, payload);
  return data;
};

export const getFeaturedDropsAdmin = async () => {
  const { data } = await api.get("/api/featured-drops");
  return data;
};

export const createFeaturedDrop = async (payload) => {
  const { data } = await api.post("/api/featured-drops", payload);
  return data;
};

export const updateFeaturedDrop = async (id, payload) => {
  const { data } = await api.put(`/api/featured-drops/${id}`, payload);
  return data;
};

export const deleteFeaturedDrop = async (id) => {
  const { data } = await api.delete(`/api/featured-drops/${id}`);
  return data;
};

export const upsertPolicy = async (key, payload) => {
  const { data } = await api.put(`/api/policies/${key}`, payload);
  return data;
};
