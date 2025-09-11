import axios from "axios";
import { loadingManager } from "./src/contexts/LoadingContext";

const apiClient = axios.create({
  baseURL: "https://doctormanagement-2p8n.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to add Bearer Token
apiClient.interceptors.request.use((config) => {
  try {
    // mark global loading start
    loadingManager.increment();
    // Get the token from localStorage (React.js equivalent of AsyncStorage)
    const token = localStorage.getItem("Token");
    console.log(token);
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  } catch (error) {
    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
});

// Response interceptors to stop global loading regardless of outcome
apiClient.interceptors.response.use(
  (response) => {
    loadingManager.decrement();
    return response;
  },
  (error) => {
    loadingManager.decrement();
    return Promise.reject(error);
  }
);

export default apiClient;
