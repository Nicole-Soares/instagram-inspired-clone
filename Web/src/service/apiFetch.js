import Storage from './storage';

/**
 * Función auxiliar para manejar las peticiones a la API.
 * Se encarga de la lógica de autenticación y manejo de errores 401.
 */
const apiFetch = async (url, options = {}, message) => {

    const token = Storage.getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token || '', 
        ...options.headers, 
    };

    const fetchOptions = {
        ...options, 
        headers: headers, 
    };
    
  
    const response = await fetch(url, fetchOptions);

    // --- LÓGICA DE MANEJO DE ERRORES CENTRALIZADA ---
    
    // manejo del 401 (Unauthorized)
    if (response.status === 401) {
        console.error("Error 401: Token inválido o expirado.");
        Storage.clearToken();
    
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error; 
        
    }

    //manejo del 404 (Not Found)
    if (response.status === 404) {
        console.error("Error 404: Not Found");
        const error = new Error("Not Found");
        error.status = 404;
        throw error;
        
    }

    // 2. Manejo de otros errores 4xx/5xx
    if (!response.ok) {
        let errorData = {};
        // Intentamos obtener el cuerpo JSON del error
        try {
            errorData = await response.json();
        } catch (e) {
            // Si falla, usamos el texto de estado HTTP o el mensaje por defecto
            errorData.message = response.statusText || message;
            console.error(e);
        }

        // Error 403 o cualquier otro error general de la API
        throw new Error(errorData.message || message);
    }
    
    // manejo de la respuesta 204 (No Content)
    // Crucial para peticiones PUT, DELETE o POST que no devuelven cuerpo
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {}; // Devolvemos un objeto vacío para evitar errores al intentar parsear JSON
    }

    // (200-299) todo ok
    return response.json();
};

export default apiFetch;