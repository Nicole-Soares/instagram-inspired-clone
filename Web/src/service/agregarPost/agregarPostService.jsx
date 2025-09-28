const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTkwMDU0ODksImV4cCI6MTc1OTA5MTg4OX0.JCQk5J6uY8DPIfMN8D48RQIOfbGqphExApanfGZQNe8';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH_TOKEN,
};

export const crearPost = async (image, description) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ image, description }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo crear el post.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en crearPost:', error);
      throw error;
    }
  };
  