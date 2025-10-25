import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const registerUser = async (userData) => {
    return apiClient.post('auth/register', userData);
}

export const loginUser = async (credentials) => {
    return apiClient.post('auth/login', credentials);
}

export default apiClient;
