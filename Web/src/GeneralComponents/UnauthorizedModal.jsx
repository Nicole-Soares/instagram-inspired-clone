import React from 'react';
import { Link, useNavigate } from "react-router";
import '../style/UnauthorizedModal.css';

const UnauthorizedModal = () => {
  const navigate = useNavigate();
  return(

  <div className="modalBloqueo">
    <div className="modalContenido">
      <h2>Acceso restringido 🔒</h2>
      <p>Debés iniciar sesión para ver este post.</p>
      <button onClick={() => navigate("/login")}>Ir al login</button>
      <button onClick={() => navigate("/register")}>Ir a registrar</button>
    </div>
  </div>

  )
};

export default UnauthorizedModal;
