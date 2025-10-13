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
    
    // 1. Manejo del 401 (Unauthorized)
    if (response.status === 401) {
        console.error("Error 401: Token inválido o expirado. Sesión cerrada.");
        Storage.clearToken();
        // Lanzamos un error específico para detener la ejecución
        throw new Error("Unauthorized"); 
        
    }

    // 2. Manejo de otros errores 4xx/5xx
    if (!response.ok) {
        let errorData = {};
        // Intentamos obtener el cuerpo JSON del error
        try {
            errorData = await response.json();
            console.log(errorData)
        } catch (e) {
            // Si falla, usamos el texto de estado HTTP o el mensaje por defecto
            errorData.message = response.statusText || message;
            console.error(e);
        }

        // Se mantiene la lógica de errores específicos para que el componente los maneje
        if (response.status === 404) {
            throw new Error(errorData.message || "Not Found"); 
            
        }
        // Error 403 o cualquier otro error general de la API
        throw new Error(errorData.message || message);
    }
    
    // 3. Manejo de la respuesta 204 (No Content)
    // Crucial para peticiones PUT, DELETE o POST que no devuelven cuerpo
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {}; // Devolvemos un objeto vacío para evitar errores al intentar parsear JSON
    }

    // Si todo está bien y hay contenido, devuelve el JSON
    return response.json();
};

export default apiFetch;