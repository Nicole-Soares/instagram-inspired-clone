// service/Api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//cliente axios
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7070',
});

// Interceptor: siempre agrega Authorization con el token guardado (SIN Bearer)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;   
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// ===== AUTH =====
export const login = async (email, password) => {
  const { data, headers } = await api.post('/login', { email, password });
  const token = data?.token ?? headers?.authorization ?? headers?.Authorization;
  if (!token) throw new Error('La API no devolvió token');
  await AsyncStorage.setItem('token', token);
  return data;
};

export const register = async (name, email, password, image) => {
  const { data, headers } = await api.post('/register', { name, email, password, image });
  const token = data?.token ?? headers?.authorization ?? headers?.Authorization;
  if (token) await AsyncStorage.setItem('token', token);
  return data;
};

// ===== USER AND USERS =====
export const getUser = () => api.get('/user');                 // perfil/timeline del logueado
export const getUserById = (userId) => api.get(`/user/${userId}`);
export const toggleFollow = (userId) => api.put(`/users/${userId}/follow`);

// ===== POSTS =====
export const createPost   = (image, description) => api.post('/posts', { image, description });
export const getPostById  = (postId) => api.get(`/posts/${postId}`);
export const updatePost   = (postId, image, description) => api.put(`/posts/${postId}`, { image, description });
export const deletePost   = (postId) => api.delete(`/posts/${postId}`);
export const toggleLike   = (postId) => api.put(`/posts/${postId}/like`);
export const addComment   = (postId, comment) => api.post(`/posts/${postId}/comment`, { comment });

// ===== SEARCH ===== CHEQUEAR
export const search = (query) => api.get(`/search?query=${encodeURIComponent(query)}`);

