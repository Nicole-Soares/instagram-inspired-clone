import apiFetch from '../apiFetch';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const crearPost = async (image, description) => {
  return apiFetch(
    `${API_BASE_URL}/posts`, 
    { 
        method: 'POST', 
        body: JSON.stringify({ image: image, description: description}) 
    }, 
    "Error al crear el post" 
);
  };
  