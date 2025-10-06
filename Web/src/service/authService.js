import Storage from "./storage";

const API = 'http://localhost:7070';

const authRequest = async (endpoint, data) => {
  try {
    const res = await fetch(`${API}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Error en ${endpoint}`);
    }

    const responseData = await res.json();
    const token = res.headers.get("Authorization");
    
    if (!token) throw new Error("No se recibió un token de autorización");
    
    Storage.setToken(token);
    return responseData;
    
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    throw error;
  }
};

const userLogin = (email, password) => 
  authRequest("login", { email, password });

const userRegister = (name, email, password, image) => 
  authRequest("register", { name, email, password, image });

export { userLogin, userRegister };