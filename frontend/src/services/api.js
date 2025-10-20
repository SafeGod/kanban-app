import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configurar axios para incluir el token en todas las peticiones
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Servicios de Tableros
export const boardService = {
  getBoards: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  getBoard: async (boardId) => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  },

  createBoard: async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response.data;
  },

  updateBoard: async (boardId, boardData) => {
    const response = await api.put(`/boards/${boardId}`, boardData);
    return response.data;
  },

  deleteBoard: async (boardId) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
  },

  // Columnas
  addColumn: async (boardId, columnData) => {
    const response = await api.post(`/boards/${boardId}/columns`, columnData);
    return response.data;
  },

  updateColumn: async (boardId, columnId, columnData) => {
    const response = await api.put(`/boards/${boardId}/columns/${columnId}`, columnData);
    return response.data;
  },

  deleteColumn: async (boardId, columnId) => {
    const response = await api.delete(`/boards/${boardId}/columns/${columnId}`);
    return response.data;
  },

  // Tareas
  addTask: async (boardId, taskData) => {
    const response = await api.post(`/boards/${boardId}/tasks`, taskData);
    return response.data;
  },

  updateTask: async (boardId, taskId, taskData) => {
    const response = await api.put(`/boards/${boardId}/tasks/${taskId}`, taskData);
    return response.data;
  },

  moveTask: async (boardId, taskId, moveData) => {
    const response = await api.put(`/boards/${boardId}/tasks/${taskId}/move`, moveData);
    return response.data;
  },

  deleteTask: async (boardId, taskId) => {
    const response = await api.delete(`/boards/${boardId}/tasks/${taskId}`);
    return response.data;
  }
};

export default api;
