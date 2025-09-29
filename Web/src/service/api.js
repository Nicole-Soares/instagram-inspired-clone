import Storage from "./storage";

const API = 'http://localhost:7070';

const userLogin = (email, password) => 
  fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error en login");
        }
  
        const token = res.headers.get("Authorization");
        const data = await res.json();
  
        Storage.setToken(token);
        console.log("Usuario:", data);
    });

const userRegister = (name, email, password, image) => 
  fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, image}),
    })
    .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error en registro");
        }
  
        const token = res.headers.get("Authorization");
        const data = await res.json();
  
        Storage.setToken(token);
        console.log("Usuario:", data);
    });


export {userLogin, userRegister};