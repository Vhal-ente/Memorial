import { api } from "./axios";

// export const getPublicImages = async (limit = 20, cursor?: number) => {
//   const { data } = await api.get(
//     `/api/images/all?limit=${limit}&cursor=${cursor ?? 0}`
//   );

//   return data;
// };

export const getAdminImages = async (limit = 20, cursor?: number) => {
  const { data } = await api.get(
    `/api/images/all`
  );

  return data;
};

export const deleteImage = async (
  id: number
) => {
  const response = await api.delete(
    `/api/images/delete/${id}`
  );

  return response.data;
};

export const restoreImage = async (
  id: number
) => {
  const response = await api.post(
    `/api/images/restore/${id}`
  );

  return response.data;
};

export const permanentlyDeleteImage = async (
  id: number
) => {
  const response = await api.delete(
    `/api/images/permanent-delete/${id}`
  );

  return response.data;
};