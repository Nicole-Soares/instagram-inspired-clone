const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Storage from "../storage";

const userLogin = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    //recibio una respuesta con codigo de error
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error en el login");
    }
    //clono la respuesta para no perder el body al leer los headers
    const resClone = res.clone(); 

    //busco el token
    const token = res.headers.get("Authorization");
    if (token) {
      Storage.setToken(token);
    } else {
      throw new Error("No se recibió un token de autorización");
    }

    //busco el id del usuario en el body
    const data = await resClone.json();
    //Si el id del usuario existe, lo guardo en el localStorage. Sino, muestro una advertencia en la consola.
    if(data.id){
      Storage.setUserId(data.id);
       // 💡 CONSOLA DE VERIFICACIÓN (OPCIONAL):
            // console.log("ID del usuario GUARDADO:", data.id);
    } else {
        console.warn("Advertencia: El ID del usuario no se encontró en la respuesta del servidor."); 
    }

    return data;
   
  } catch (error) {
    console.error("Error en el login:", error);
    throw error; 
  }
};

export { userLogin };