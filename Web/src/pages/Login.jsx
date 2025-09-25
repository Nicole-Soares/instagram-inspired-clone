import { useState } from "react";
import loginPhoto from '../assets/instagram-login-photo.png'
import textLogo from '../assets/instagram-text-logo.svg'
import '../style/Login.css'
import { useNavigate } from 'react-router'
import { useEffect } from "react";
import instagramLogo from '../assets/Instagram_icon.png'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false); // <-- estado de carga inicial
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  fetch("http://localhost:7070/login", {
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

      localStorage.setItem("token", token);
      console.log("Usuario:", data);

      //navigate(`/Home`);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
};

  return (
    <div className="login-container">
      <img src = {loginPhoto} alt="Login" className="login-photo"/>

      <div className="login">
        
        <img src = {textLogo} alt="textLogo" className="text-logo"/>
        
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />  
           <button type="submit" disabled={loading}>
            {loading ? <span className="button-spinner"></span> : "Iniciar sesión"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        <div className="login-footer">
          <hr class="divider" />
          <p>¿No tienes una cuenta? <a href="">Regístrate</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;