import axios from "axios";
const baseURL = import.meta.env.BACKEND_URL as string;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    return Promise.reject({
      status: error?.response?.status,
      message,
      errors: error?.response?.data?.errors || [],
    });
  },
);

export default api;
