
import { jwtDecode } from 'jwt-decode';
import Storage from './storage'; 

export const getUserId = () => {
  const token = Storage.getToken();

  if (!token) {
    return null; // Si no hay token, el usuario no está logueado
  }

  try {
    const decodedToken = jwtDecode(token);

    return decodedToken.userId; 
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};