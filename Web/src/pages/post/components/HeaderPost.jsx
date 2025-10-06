import React from 'react';
import { formateoFecha } from '../../../utils/formateoFecha';

const HeaderPost = ({ user, date }) => {

    //si el post actual es del que lo esta viendo ahora tendria que aparecerle dos iconos, uno de editar otro de eliminar
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