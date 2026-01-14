import api from "./client";

export const checkout = async (payload) => {
  const { data } = await api.post("/api/checkout", payload);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/api/orders/my");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/api/orders/${id}`);
  return data;
};
