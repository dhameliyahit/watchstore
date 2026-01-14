import api from "./client";

export const validateCoupon = async ({ code, orderAmount }) => {
  const { data } = await api.post("/api/coupons/validate", {
    code,
    orderAmount,
  });
  return data;
};
