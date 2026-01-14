import api from "./client";

export const getFeaturedDrops = async () => {
  const { data } = await api.get("/api/featured-drops");
  return data;
};
