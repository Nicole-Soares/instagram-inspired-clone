// utils/isTokenExpired.js
import jwt_decode from "jwt-decode";


export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwt_decode(token);
    const now = Date.now() / 1000; 
    return decoded.exp < now;
  } catch (error) {
    console.warn("Token inválido o no decodificable:", error);
    return true; 
  }
};
