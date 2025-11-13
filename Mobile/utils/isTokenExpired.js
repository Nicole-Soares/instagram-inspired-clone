import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {

    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;

    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    console.warn("Token inválido o no decodificable:", error);
    return false;
  }
};
