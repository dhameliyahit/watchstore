import api from "./client";

export const initiateCashfree = async (orderId) => {
  const { data } = await api.post("/api/payments/cashfree/initiate", {
    orderId,
  });
  return data;
};

export const verifyCashfree = async (payload) => {
  const { data } = await api.post("/api/payments/cashfree/callback", payload);
  return data;
};
