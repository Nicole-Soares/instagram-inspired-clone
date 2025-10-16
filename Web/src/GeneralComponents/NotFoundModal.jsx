import React from 'react';
import { useNavigate } from "react-router-dom";
import '../style/UnauthorizedModal.css'; 

const NotFoundModal = () => {
    const navigate = useNavigate(); 
    return(

  <div className="modalBloqueo">
    <div className="modalContenido">
      <h2>No se ha encontrado lo solicitado ⚠️ </h2>
      <button onClick={() => navigate("/home")}>Volver al Inicio</button>
    </div>
  </div>

  )
};

export default NotFoundModal;