import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
    return apiClient.post('auth/register', userData);
}

export const loginUser = async (credentials) => {
    return apiClient.post('auth/login', credentials);
}

export const getTask = (params = {}) => {
    return apiClient.get('/tasks', { params });
};

export const createTask = (taskData) => {
    return apiClient.post('/tasks', taskData);
}

export const updateTask = (taskId, taskData) => {
    return apiClient.put(`/tasks/${taskId}`, taskData);
};

 export const deleteTask = (taskId) => {
    return apiClient.delete(`/tasks/${taskId}`);
};

export const logoutUser = () => {
    return apiClient.post('auth/logout');
}

export default apiClient;
