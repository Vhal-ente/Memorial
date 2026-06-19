import { api } from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post(
    "/api/auth/login",
    payload
  );

  return response.data;
};

export const refreshToken = async (
  refreshToken: string
) => {
  const response = await api.post(
    "/api/auth/refresh",
    {
      refreshToken,
    }
  );

  return response.data;
};