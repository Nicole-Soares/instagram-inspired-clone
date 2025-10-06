import Storage from './storage';

let navigateFunction = null;

export const setNavigateFunction = (navigate) => {
  navigateFunction = navigate;
};

/**
 * Función auxiliar para manejar las peticiones a la API.
 * Se encarga de la lógica de autenticación y manejo de errores 401.
 */
const apiFetch = async (url, options = {}, message) => {

  const token = Storage.getToken();
  
   const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
    ...options.headers, // Esto permite pasar headers personalizados
  };

   
    const fetchOptions = {
      ...options, // Pasa el método, el body y cualquier otra opción
      headers: headers, 
    };
    
  const response = await fetch(url, fetchOptions);

  // Manejo de errores centralizado
  if (response.status === 401) {
    // Eliminar el token de localStorage 
    Storage.clearToken();
    // Redirigir al usuario
    if (navigateFunction) {
      navigateFunction('/login');
    }
    throw new Error("Unauthorized"); 
  }

  // Manejo de otros errores
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || message);
  }

  return response.json();
};

export default apiFetch;