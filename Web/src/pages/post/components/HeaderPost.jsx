import React from 'react';
import { formateoFecha } from '../../../utils/formateoFecha';

const HeaderPost = ({ user, date }) => {
    return (
        <div className="contenedorImagenUsuario">
            <img src={user.image} alt="Imagen del usuario" />
            <div className="datosUsuarioPost">
                <p className="nombreUsuario">{user.name || "Usuario desconocido"}</p>
                <p className="fechaPost">{formateoFecha(date)}</p>
            </div>
        </div>
    );
};

export default HeaderPost;