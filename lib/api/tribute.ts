import { api } from "./axios";

export const getAdminTributes = async (limit = 20, cursor = 0) => {
  const { data } = await api.get(
    `/api/tribute/all`
  );

  return data;
};

export const approveTribute = async (id: number) => {
  const { data } = await api.post(`/api/tribute/approve/${id}`);
  return data;
};

export const rejectTribute = async (id: number) => {
  const { data } = await api.post(`/api/tribute/reject/${id}`);
  return data;
};

export const deleteTribute = async (id: number) => {
  const { data } = await api.delete(`/api/tribute/delete/${id}`);
  return data;
};