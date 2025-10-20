import apiFetch from "../apiFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async (userId) => {
    return apiFetch(`${API_BASE_URL}/user/${userId}`, { 
        method: "GET",
        
    }, "Error al obtener el perfil de usuario");
};

export const followUser = async (userId) => {
    return apiFetch(`${API_BASE_URL}/users/${userId}/follow`, { 
        method: "PUT" 
    }, "Fallo al realizar la accion de seguir/dejar de seguir.");
};

