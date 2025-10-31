// src/services/apiServices.ts
import axios from "axios";
import router from "../router";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const endpoint = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach access token if available
endpoint.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle expired sessions globally
endpoint.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please log in again.",
      });
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default endpoint;