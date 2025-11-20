import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Cliente axios
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7070',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers['authorization'] = token;
  } else {
    delete config.headers['authorization'];
  }

  return config;
});

// ===== AUTH =====
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });

  // el backend manda el token en header "authorization"
  const token =
    response.data?.token ??
    response.headers['authorization'];

  const userId = response.data.id;

  if (!token) throw new Error('Credenciales incorrectas. La API no devolvió token.');
  if (!userId) throw new Error("No se encontró el ID del usuario en la respuesta");

  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem("userId", String(userId));

  return response.data;
};

export const register = async (name, email, password, image) => {
  const response = await api.post('/register', {
    name, email, password, image
  });

  return response.data; 
};



// ===== USER AND USERS =====
export const getUser = () => api.get('/user');                 // perfil/timeline del logueado
export const getUserById = (userId) => api.get(`/user/${userId}`);
export const toggleFollow = (userId) => api.put(`/users/${userId}/follow`);

// ===== POSTS =====
export const createPost = async (image, description) => {
  const { data } = await api.post('/posts', { image, description });
  return data; 
};

export const getPostById = async (postId) => {
  const { data } = await api.get(`/posts/${postId}`);
  return data; 
};
export const updatePost   = (postId, image, description) => api.put(`/posts/${postId}`, { image, description });
export const deletePost   = (postId) => api.delete(`/posts/${postId}`);

export const likePost = async (postId) => {
  const { data } = await api.put(`/posts/${postId}/like`);
  return data;
};

export const addComment = async (postId, body) => {
  const response = await api.post(`/posts/${postId}/comment`, { body });
  return response.data; 
};

// ===== SEARCH ===== 
export const search = (query) => api.get(`/search?query=${encodeURIComponent(query)}`);

