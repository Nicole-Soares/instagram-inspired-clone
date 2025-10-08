import { jwtDecode } from 'jwt-decode'; 

const setToken = (token) => {
    localStorage.setItem("token", token);
};

const getToken = () => localStorage.getItem("token");

const clearToken = () => {
    localStorage.removeItem("token");
};

const getUserId = () => {
    const token = getToken();
    if (!token) return null;
    
    try {
        const payload = jwtDecode(token);
        return payload ? payload.userId : null; 
    } catch (error) {
        console.error("Error decodificando el token:", error);
        return null;
    }
};

const Storage = { 
    setToken, 
    getToken, 
    clearToken, 
    getUserId 
};

export default Storage;