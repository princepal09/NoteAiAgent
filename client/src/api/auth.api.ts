import api from "@/lib/axios";
import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

export const registerUser = async (data: RegisterFormData) => {
  const response = await api.post("/user/register", data);
  return response.data.data;
};
export const loginUser = async (data: LoginFormData) => {
  const response = await api.post("/user/login", data);
  return response.data.data;
};

export const logoutUser = async () => {
  const response = await api.post("/user/logout");
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/user/currentUser");
  return response.data.data;
};
