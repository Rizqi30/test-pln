import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

// Fungsi untuk membuat instance axios yang disesuaikan
const createAxiosInstance = (baseUrl: string): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: baseUrl + "/api", // Menggunakan baseUrl yang diberikan
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // Menambahkan Authorization Token jika ada
      const token = Cookies.get("next-auth.session-token"); // Ambil token dari localStorage (misalnya)
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Jika ada error dalam request
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Menangani error global dari response
      console.error("Response Error:", error);
      if (error.response && error.response.status === 401) {
        console.log("Session expired. Redirecting to login...");
        // Anda bisa menambahkan redirect ke halaman login di sini
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Membuat instance axios dengan baseUrl yang disesuaikan
const instanceBaseUrl = createAxiosInstance(
  process.env.NEXT_PUBLIC_BASE_URL as string
);

// Mengekspor instanceBaseUrl langsung
export default instanceBaseUrl;
